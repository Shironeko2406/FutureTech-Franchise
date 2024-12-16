import React, { useState } from "react";
import { Modal, Typography, Descriptions, Tag, List, Button, Space, Tooltip, Popconfirm, Tabs } from "antd";
import { CalendarOutlined, ClockCircleOutlined, DeleteOutlined, EditOutlined, PlusOutlined, InfoCircleOutlined, ScheduleOutlined, FileTextOutlined } from "@ant-design/icons";
import styled from "styled-components";
import moment from 'moment';
import { useDispatch, useSelector } from "react-redux";
import { useLoading } from "../../Utils/LoadingContext";
import { UpdateStatusTaskByIdActionAsync } from "../../Redux/ReducerAPI/WorkReducer";
import { useParams } from "react-router-dom";
import CreateAppointmentModal from "./CreateAppointmentModal";
import { DeleteAppointmentByIdActionAsync, GetAppointmentDetailByIdActionAsync, setAppointmentDetail } from "../../Redux/ReducerAPI/AppointmentReducer";
import EditAppointmentModal from "./EditAppointmentModal";
import DOMPurify from 'dompurify';
import ViewAppointmentDetailModal from "./ViewAppointmentDetailModal";

const { Title, Text } = Typography;

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  .ant-modal-body {
    max-height: calc(100vh - 200px);
    overflow-y: auto;
  }
`;

const StyledTitle = styled(Title)`
  margin-bottom: 16px !important;
`;

const StyledTag = styled(Tag)`
  font-size: 14px;
  padding: 4px 8px;
`;

const StatusTag = styled.span`
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  color: white;
`;

const AppointmentItem = styled(List.Item)`
  padding: 12px !important;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f9f9f9;
  }
`;

const AppointmentTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  align-items: center;
`;

const AppointmentTime = styled.div`
  color: #8c8c8c;
  font-size: 14px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const HTMLContent = styled.div`
  h1, h2, h3, h4, h5, h6 {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }
  ul, ol {
    padding-left: 20px;
  }
`;

const taskTypeTranslations = {
  Interview: "Phỏng vấn",
  AgreementSigned: "Ký thỏa thuận 2 bên",
  BusinessRegistered: "Đăng ký doanh nghiệp",
  SiteSurvey: "Khảo sát mặt bằng",
  Design: "Thiết kế",
  Quotation: "Báo giá cho khách hàng",
  SignedContract: "Ký hợp đồng thành công",
  ConstructionAndTrainning: "Đào tạo và thi công",
  Handover: "Bàn giao",
  EducationLicenseRegistered: "Đăng ký giấy phép giáo dục"
};

const statusTaskTranslations = {
  None: "Chờ xử lý",
  Approved: "Đã duyệt",
  Rejected: "Từ chối",
};

const getStatusColor = (status) => {
  switch (status) {
    case "Approved": return '#52c41a';
    case "Rejected": return '#f5222d';
    case "None":
    default: return '#d9d9d9';
  }
};

const getAppointmentStatus = (startTime, endTime) => {
  const now = moment();
  const start = moment(startTime);
  const end = moment(endTime);

  if (now < start) {
    return { status: "Chưa diễn ra", color: "orange" };
  } else if (now >= start && now <= end) {
    return { status: "Đang diễn ra", color: "green" };
  } else {
    return { status: "Đã kết thúc", color: "red" };
  }
};

const handleDownloadFile = (url) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = url.split('/').pop();
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const formatCurrency = (amount) => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
};

const ViewTaskDetailModal = ({ visible, onClose, setVisible, isFromAgencyDetail, selectedType, isFromTaskDetail }) => {
  const { taskDetail } = useSelector((state) => state.WorkReducer);
  const { agencyStatus } = useSelector((state) => state.AgencyReducer);
  const dispatch = useDispatch();
  const { setLoading } = useLoading();
  const { id: agencyId } = useParams();
  const [isAddAppointmentModalVisible, setIsAddAppointmentModalVisible] = useState(false);
  const [isViewAppointmentModalVisible, setIsViewAppointmentModalVisible] = useState(false);
  const [isEditAppointmentModalVisible, setIsEditAppointmentModalVisible] = useState(false);

  const handleUpdateStatusTaskById = (taskId, status) => {
    Modal.confirm({
      title: status === 'Approved' ? 'Xác nhận Duyệt' : 'Xác nhận Từ chối',
      content: `Bạn có chắc chắn muốn ${status === 'Approved' ? 'duyệt' : 'từ chối'} nhiệm vụ này?`,
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: () => {
        dispatch(UpdateStatusTaskByIdActionAsync(taskId, status, agencyId));
      },
    });
  };

  const handleDeleteAppointment = (appointmentId) => {
    setLoading(true);
    dispatch(DeleteAppointmentByIdActionAsync(appointmentId, taskDetail.id)).finally(() => setLoading(false));
  };

  //Hàm dòng mở modal
  const showAddAppointmentModal = () => {
    setIsAddAppointmentModalVisible(true);
    onClose();
  };

  const handleAddAppointmentCancel = () => {
    setIsAddAppointmentModalVisible(false);
    setVisible(true);
  };

  const showViewAppointmentDetailModal = (id) => {
    setIsViewAppointmentModalVisible(true);
    dispatch(GetAppointmentDetailByIdActionAsync(id));
    onClose();
  };

  const handleViewAppointmentDetailCancel = () => {
    setIsViewAppointmentModalVisible(false);
    setVisible(true);
    dispatch(setAppointmentDetail({}))
  };

  const showEditAppointmentByIdModal = (id) => {
    setIsEditAppointmentModalVisible(true);
    dispatch(GetAppointmentDetailByIdActionAsync(id));
    onClose();
  };

  const handleEditAppointmentByIdCancel = () => {
    setIsEditAppointmentModalVisible(false);
    setVisible(true);
  };
  //----------------------------------

  const sanitizeHTML = (html) => {
    return {
      __html: DOMPurify.sanitize(html)
    };
  };

  const tabItems = [
    {
      key: '1',
      label: "Thông tin chung",
      children: (
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Giai đoạn">
            <StyledTag color="blue">
              {taskTypeTranslations[taskDetail?.type] || taskDetail?.type || "Không xác định"}
            </StyledTag>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <StatusTag style={{ backgroundColor: getStatusColor(taskDetail?.status) }}>
              {(statusTaskTranslations[taskDetail?.status] || taskDetail?.status || "Không xác định").toUpperCase()}
            </StatusTag>
          </Descriptions.Item>
          <Descriptions.Item label="Người duyệt">
            {taskDetail?.approvedBy?.username || "Không có"}
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian">
            <CalendarOutlined /> {taskDetail?.startDate ? moment(taskDetail.startDate).format('DD/MM/YYYY HH:mm') : "N/A"} -{" "}
            {taskDetail?.endDate ? moment(taskDetail.endDate).format('DD/MM/YYYY HH:mm') : "N/A"}
          </Descriptions.Item>
        </Descriptions>
      ),
    },
    {
      key: '2',
      label: "Mô tả",
      children: (
        <div>
          {taskDetail?.description ? (
            <HTMLContent dangerouslySetInnerHTML={sanitizeHTML(taskDetail.description)} />
          ) : (
            <Text type="secondary">Không có mô tả</Text>
          )}
        </div>
      ),
    },
    {
      key: '3',
      label: "Lịch hẹn",
      children: (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <Title level={5} style={{ margin: 0 }}>Danh sách lịch hẹn</Title>
            {isFromAgencyDetail && taskDetail?.status === "None" &&
              ['Processing', 'Approved'].includes(agencyStatus) && (
                <Button type="primary" icon={<PlusOutlined />} onClick={showAddAppointmentModal}>
                  Thêm cuộc họp
                </Button>
              )}
          </div>
          <List
            dataSource={taskDetail?.appointments || []}
            renderItem={(appointment) => {
              const { status, color } = getAppointmentStatus(appointment?.startTime, appointment?.endTime);
              return (
                <AppointmentItem style={{ cursor: "pointer" }} onClick={() => showViewAppointmentDetailModal(appointment?.id)}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
                      <AppointmentTitle>
                        {appointment?.title || "Không có tiêu đề"}
                        <StyledTag color={color} style={{ marginLeft: '8px' }}>
                          {status}
                        </StyledTag>
                      </AppointmentTitle>
                      {isFromAgencyDetail && taskDetail?.status === "None" &&
                        ['Processing', 'Approved'].includes(agencyStatus) && (
                          <Space>
                            <Tooltip title="Sửa">
                              <Button
                                type="text"
                                icon={<EditOutlined />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  showEditAppointmentByIdModal(appointment?.id)
                                }}
                                size="small"
                              />
                            </Tooltip>
                            <Tooltip title="Xóa">
                              <Popconfirm
                                title="Bạn muốn xóa cuộc họp này?"
                                onConfirm={(e) => {
                                  e.stopPropagation();
                                  handleDeleteAppointment(appointment?.id);
                                }}
                                onCancel={(e) => e.stopPropagation()}
                              >
                                <Button
                                  type="text"
                                  icon={<DeleteOutlined />}
                                  danger
                                  onClick={(e) => e.stopPropagation()}
                                  size="small"
                                />
                              </Popconfirm>
                            </Tooltip>
                          </Space>
                        )}
                    </Space>
                    <AppointmentTime>
                      <ClockCircleOutlined /> {appointment?.startTime ? moment(appointment.startTime).format('DD/MM/YYYY HH:mm') : "N/A"} - {appointment?.endTime ? moment(appointment.endTime).format('DD/MM/YYYY HH:mm') : "N/A"}
                    </AppointmentTime>
                  </Space>
                </AppointmentItem>
              );
            }}
          />
        </div>
      ),
    },
    {
      key: '4',
      label: "Báo cáo",
      children: (
        <div>
          {taskDetail?.report ? (
            <HTMLContent dangerouslySetInnerHTML={sanitizeHTML(taskDetail.report)} />
          ) : (
            <Text type="secondary">Không có báo cáo</Text>
          )}
          {taskDetail?.type === 'Design' && taskDetail?.designFee && (
            <Text type="secondary" style={{ marginTop: '16px' }}>
              Giá tiền thiết kế: {formatCurrency(taskDetail?.designFee)}
            </Text>
          )}
          {taskDetail?.reportImageURL && <br />}
          {taskDetail?.reportImageURL && (
            <Button
              type="primary"
              icon={<FileTextOutlined />}
              href={taskDetail.reportImageURL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginTop: '16px' }}
            >
              Xem tài liệu đính kèm
            </Button>
          )}
          {taskDetail?.customerSubmit && (taskDetail?.type === 'AgreementSigned' || taskDetail?.type === 'SignedContract') && (
            <Button
              type="primary"
              icon={<FileTextOutlined />}
              onClick={() => handleDownloadFile(taskDetail.customerSubmit)}
              style={{ marginTop: '16px' }}
            >
              Xem tài liệu bên liên quan nộp
            </Button>
          )}
        </div>
      ),
    },
  ];

  const filteredTabItems = isFromAgencyDetail && taskDetail?.submit === "Submited"
    ? tabItems
    : tabItems.filter(item => item.key !== '4');

  return (
    <>
      <StyledModal
        title={<StyledTitle level={3}>Chi tiết nhiệm vụ</StyledTitle>}
        open={visible}
        onCancel={onClose}
        footer={
          isFromAgencyDetail && taskDetail?.status === "None" &&
          ['Processing', 'Approved'].includes(agencyStatus) && (
            <ModalFooter>
              <Button onClick={() => handleUpdateStatusTaskById(taskDetail?.id, 'Rejected')}>
                Từ chối
              </Button>
              <Button type="primary" onClick={() => handleUpdateStatusTaskById(taskDetail?.id, 'Approved')}>
                Duyệt
              </Button>
            </ModalFooter>
          )
        }
        width={700}
      >
        <Tabs items={filteredTabItems} />
      </StyledModal>

      <CreateAppointmentModal
        visible={isAddAppointmentModalVisible}
        onClose={handleAddAppointmentCancel}
        workId={taskDetail.id}
        selectedType={selectedType}
      />

      <ViewAppointmentDetailModal
        visible={isViewAppointmentModalVisible}
        onClose={handleViewAppointmentDetailCancel}
        selectedType={selectedType}
        isFromTaskDetail={isFromTaskDetail}
      />

      <EditAppointmentModal
        visible={isEditAppointmentModalVisible}
        onClose={handleEditAppointmentByIdCancel}
        workId={taskDetail.id}
      />
    </>
  );
};

export default ViewTaskDetailModal;





