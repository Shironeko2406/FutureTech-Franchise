import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, List, Typography, Button, Tag, Modal, message } from 'antd';
import { UploadOutlined, EyeOutlined } from "@ant-design/icons";
import { CalendarOutlined, RightCircleOutlined, CheckCircleFilled, CloseCircleFilled, MinusCircleFilled, FlagOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import moment from 'moment';
import DynamicFilter from '../../Components/DynamicFilter';
import { GetTaskUserByLoginActionAsync } from '../../../Redux/ReducerAPI/UserReducer';
import ViewTaskDetailModal from '../../../Manager/Modal/ViewTaskDetailModal';
import { GetTaskDetailByIdActionAsync, SubmitTaskReportActionAsync, UpdateTaskStatusActionAsync } from '../../../Redux/ReducerAPI/WorkReducer';
import SubmitTaskReportModal from '../../Modal/SubmitTaskReportModal';
import { useLoading } from '../../../Utils/LoadingContext';
import ShowReportModal from '../../Modal/ShowReportModal';
import { CreateEquipmentActionAsync } from '../../../Redux/ReducerAPI/EquipmentReducer';

const { Title, Text } = Typography;

const CompulsoryTask = styled(List.Item)`
  background-color: #fff1f0 !important;
`;

const StatusTag = styled(Tag)`
  margin-right: 8px;
`;

const getStatusIcon = (status) => {
  const iconStyle = { fontSize: 24, color: getStatusColor(status) };
  switch (status) {
    case "Approved": return <CheckCircleFilled style={iconStyle} />;
    case "Rejected": return <CloseCircleFilled style={iconStyle} />;
    case "None":
    default: return <MinusCircleFilled style={iconStyle} />;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "Approved": return '#52c41a';
    case "Rejected": return '#f5222d';
    case "None":
    default: return '#d9d9d9';
  }
};

const translateStatus = (status) => {
  const translations = {
    "Approved": "Đã duyệt",
    "Rejected": "Từ chối",
    "None": "Chưa xử lý",
  };
  return translations[status] || status;
};

const translateSubmitStatus = (submit) => {
  return submit === "Submited" ? "Đã nộp" : "Chưa nộp";
};

const getSubmitStatusColor = (submit) => {
  return submit === "Submited" ? '#1890ff' : '#faad14';
};

const ListTaskSystemInstructor = () => {
  const { taskUser, totalPagesCount } = useSelector((state) => state.UserReducer);
  const dispatch = useDispatch();
  const { setLoading } = useLoading();
  const [filters, setFilters] = useState({
    searchText: '',
    levelFilter: '',
    statusFilter: '',
    submitFilter: '',
  });
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalShowTaskDetailVisible, setModalShowTaskDetailVisible] = useState(false);
  const [modalSubmitTaskReportVisible, setModalSubmitTaskReportVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskType, setTaskType] = useState(null);
  const [modalShowReportVisible, setModalShowReportVisible] = useState(false);

  const handleFilterChange = (key, value) => {
    setFilters(prevFilters => ({ ...prevFilters, [key]: value }));
    setPageIndex(1);
  };

  const handlePageChange = (page, pageSize) => {
    setPageIndex(page);
    setPageSize(pageSize);
  };

  useEffect(() => {
    dispatch(GetTaskUserByLoginActionAsync(
      filters.searchText,
      filters.levelFilter,
      filters.statusFilter,
      filters.submitFilter,
      pageIndex,
      pageSize
    ));
  }, [filters, pageIndex, pageSize, dispatch]);

  const openModalShowTaskDetail = (id) => {
    setModalShowTaskDetailVisible(true);
    dispatch(GetTaskDetailByIdActionAsync(id));
  };

  const handleCloseModalShowTaskDetail = () => {
    setModalShowTaskDetailVisible(false);
  };

  const openModalSubmitTaskReport = (task) => {
    setSelectedTask(task);
    setTaskType(task.type);
    setModalSubmitTaskReportVisible(true);
    dispatch(GetTaskDetailByIdActionAsync(task.id)); // Fetch task details
  };

  const handleCloseModalSubmitTaskReport = () => {
    setModalSubmitTaskReportVisible(false);
    setSelectedTask(null);
  };

  const openModalShowReport = async (task) => {
    setSelectedTask(task);
    await dispatch(GetTaskDetailByIdActionAsync(task.id));
    setModalShowReportVisible(true);
  };

  const handleCloseModalShowReport = () => {
    setModalShowReportVisible(false);
    setSelectedTask(null);
  };

  const handleSubmitTaskReport = async (reportData) => {
    if (selectedTask) {
      setLoading(true);
      try {
        let formData = { ...reportData };
        if (reportData.type === "Design" && reportData.equipmentFile) {
          const equipmentFormData = new FormData();
          equipmentFormData.append('file', reportData.equipmentFile);
          const equipmentResponse = await dispatch(CreateEquipmentActionAsync(selectedTask.agencyId, equipmentFormData));
          if (!equipmentResponse) {
            CreateEquipmentActionAsync
            throw new Error("Error creating equipment");
          }
        }
        await dispatch(SubmitTaskReportActionAsync(selectedTask.id, formData));
        handleCloseModalSubmitTaskReport();
        await dispatch(GetTaskUserByLoginActionAsync(
          filters.searchText,
          filters.levelFilter,
          filters.statusFilter,
          filters.submitFilter,
          pageIndex,
          pageSize
        ));
      } catch (error) {
        message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
        console.error("Error uploading file: ", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdateTaskStatus = async (task) => {
    const newStatus = task.submit === "Submited" ? "None" : "Submited";
    await dispatch(UpdateTaskStatusActionAsync(task.id, newStatus));
    await dispatch(GetTaskUserByLoginActionAsync(
      filters.searchText,
      filters.levelFilter,
      filters.statusFilter,
      filters.submitFilter,
      pageIndex,
      pageSize
    ));
  };

  const renderItem = (task) => {
    const TaskItem = task.level === "Compulsory" ? CompulsoryTask : List.Item;
    const actions = [
      <Button
        type="text"
        style={{ color: "#1890ff" }}
        icon={<RightCircleOutlined />}
        onClick={() => openModalShowTaskDetail(task.id)}
      />
    ];

    if (task.report) {
      actions.push(
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => openModalShowReport(task)}
        >
          Xem báo cáo
        </Button>
      );
      if (task.submit !== "Submited" && task.status === "None") {
        actions.push(
          <Button
            type="primary"
            onClick={() => handleUpdateTaskStatus(task)}
          >
            Nộp báo cáo
          </Button>
        );
      } else if (task.submit === "Submited" && task.status === "None") {
        actions.push(
          <Button
            type="primary"
            danger
            onClick={() => handleUpdateTaskStatus(task)}
          >
            Hủy nộp
          </Button>
        );
      }
    } else {
      actions.push(
        <Button
          type="primary"
          icon={<UploadOutlined />}
          onClick={() => openModalSubmitTaskReport(task)}
        >
          Báo cáo
        </Button>
      );
    }

    return (
      <TaskItem
        style={{
          backgroundColor: task.level === "Compulsory" ? "#fff1f0" : "#f0f5ff",
          marginBottom: "8px",
          borderRadius: "8px",
          padding: "12px",
        }}
        key={task.id}
        actions={actions}
      >
        <List.Item.Meta
          avatar={getStatusIcon(task.status)}
          title={
            <span>
              {task.title}
              {task.level === "Compulsory" && (
                <>
                  <FlagOutlined
                    style={{ color: "#ff4d4f", marginLeft: "8px" }}
                  />
                  <Text type="danger" strong style={{ marginLeft: "4px" }}>
                    (Quan trọng)
                  </Text>
                </>
              )}
            </span>
          }
          description={
            <div>
              <StatusTag color={getStatusColor(task.status)}>
                {translateStatus(task.status).toUpperCase()}
              </StatusTag>
              <StatusTag color={getSubmitStatusColor(task.submit)}>
                {translateSubmitStatus(task.submit).toUpperCase()}
              </StatusTag>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "4px",
                }}
              >
                <CalendarOutlined style={{ marginRight: "4px" }} />
                <Text type="secondary">
                  {moment(task.startDate).format("DD/MM/YYYY HH:mm")} -{" "}
                  {moment(task.endDate).format("DD/MM/YYYY HH:mm")}
                </Text>
              </div>
            </div>
          }
        />
      </TaskItem>
    );
  };

  return (
    <Card>
      <Title level={4}>
        <CalendarOutlined /> Danh sách công việc
      </Title>
      <DynamicFilter onFilterChange={handleFilterChange} />
      <List
        dataSource={taskUser}
        renderItem={renderItem}
        pagination={{
          current: pageIndex,
          pageSize,
          total: totalPagesCount * pageSize,
          onChange: handlePageChange,
          showSizeChanger: true,
          pageSizeOptions: ['7', '10'],
        }}
        style={{ marginTop: '16px' }}
      />
      <ViewTaskDetailModal
        visible={modalShowTaskDetailVisible}
        onClose={handleCloseModalShowTaskDetail}
        setVisible={setModalShowTaskDetailVisible}
        isFromAgencyDetail={false}
      />
      <SubmitTaskReportModal
        visible={modalSubmitTaskReportVisible}
        onClose={handleCloseModalSubmitTaskReport}
        onSubmit={handleSubmitTaskReport}
        taskType={taskType}
        selectedTask={selectedTask}
      />
      <ShowReportModal
        visible={modalShowReportVisible}
        onClose={handleCloseModalShowReport}
        taskId={selectedTask?.id}
        taskType={selectedTask?.type} // Pass taskType here
      />
    </Card>
  );
};

export default ListTaskSystemInstructor;