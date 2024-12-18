import React, { useEffect, useState, useRef } from 'react';
import { Modal, Button, Typography, Spin, Descriptions, Space, Card, Form, Upload, Input, DatePicker } from 'antd';
import styled from 'styled-components';
import { FilePdfOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import DOMPurify from 'dompurify';
import { useDispatch, useSelector } from 'react-redux';
import { SubmitTaskReportActionAsync } from '../../Redux/ReducerAPI/WorkReducer';
import { CreateEquipmentActionAsync, DownloadEquipmentFileActionAsync } from '../../Redux/ReducerAPI/EquipmentReducer';
import dayjs from 'dayjs';
import ReactQuill from 'react-quill';
import { quillFormats, quillModules } from '../../TextEditorConfig/Config';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { imageDB } from "../../Firebasse/Config";
import { useLoading } from '../../Utils/LoadingContext';
import { UpdateDesignFeeActionAsync } from "../../Redux/ReducerAPI/ContractReducer";

const { Title, Text } = Typography;

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
  .ant-modal-header {
    border-bottom: 1px solid #f0f0f0;
    padding: 20px 24px;
    border-radius: 16px 16px 0 0;
  }
  .ant-modal-body {
    max-height: calc(100vh - 200px);
    overflow-y: auto;
    padding: 24px;
  }
  .ant-modal-footer {
    border-top: 1px solid #f0f0f0;
    padding: 16px 24px;
    border-radius: 0 0 16px 16px;
  }
`;

const HTMLContent = styled.div`
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  h1, h2, h3, h4, h5, h6 {
    margin-top: 1em;
    margin-bottom: 0.5em;
    font-weight: 600;
    color: #1890ff;
  }
  ul, ol {
    padding-left: 24px;
    margin-bottom: 1em;
  }
  p {
    margin-bottom: 1em;
  }
  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 1em 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const StyledDescriptions = styled(Descriptions)`
  margin-top: 24px;
  .ant-descriptions-item-label {
    font-weight: bold;
    color: #1890ff;
  }
  .ant-descriptions-item-content {
    color: #333;
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const StyledCard = styled(Card)`
  margin-top: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  .ant-card-head {
    background-color: #f0f5ff;
  }
`;

const formatCurrency = (amount) => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
};

const ShowReportModal = ({ visible, onClose, taskId, taskType }) => {
  const dispatch = useDispatch();
  const { taskDetail, loading } = useSelector((state) => state.WorkReducer);
  const { setLoading } = useLoading();
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [uploadedEquipmentFileURL, setUploadedEquipmentFileURL] = useState(null);
  const uploadedFileURLRef = useRef(null);
  const [designFee, setDesignFee] = useState('');
  const [formattedDesignFee, setFormattedDesignFee] = useState('');

  useEffect(() => {
    if (!visible) {
      setIsEditing(false);
      form.resetFields();
      setDesignFee('');
      setFormattedDesignFee('');
    }
  }, [visible]);

  const handleEditReport = () => {
    setIsEditing(true);
    form.setFieldsValue({
      report: taskDetail.report,
      reportImageURL: taskDetail.reportImageURL ? [{
        uid: '-1',
        name: 'Tệp đính kèm hiện tại',
        status: 'done',
        url: taskDetail.reportImageURL,
      }] : [],
      designFee: taskType === "Design" ? taskDetail.designFee : undefined,
    });
    if (taskType === "Design" && taskDetail.designFee) {
      setFormattedDesignFee(formatCurrency(taskDetail.designFee));
    }
  };

  const handleSaveReport = async () => {
    setLoading(true);
    try {
      console.log("handleSaveReport", uploadedFileURLRef.current);
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        reportImageURL: uploadedFileURLRef.current || (values.reportImageURL && values.reportImageURL[0] ? values.reportImageURL[0].url : null),
        designFee: taskType === "Design" ? designFee : undefined,
      };

      if (taskType === "Design" && uploadedEquipmentFileURL) {
        const equipmentFormData = new FormData();
        equipmentFormData.append('file', uploadedEquipmentFileURL);
        const equipmentResponse = await dispatch(CreateEquipmentActionAsync(taskDetail.agencyId, equipmentFormData));
        if (!equipmentResponse) {
          throw new Error("Error creating equipment");
        }
      }

      if (taskType === "Design" && designFee) {
        const designFeeResponse = await dispatch(UpdateDesignFeeActionAsync(taskDetail.agencyId, designFee));
        if (!designFeeResponse) {
          throw new Error("Error updating design fee");
        }
      }

      await dispatch(SubmitTaskReportActionAsync(taskId, formattedValues));
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving report: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async ({ file, onSuccess, onError }) => {
    const storageRef = ref(imageDB, `files/${file.name}`);
    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      uploadedFileURLRef.current = url;
      onSuccess({ url }, file);
    } catch (error) {
      console.error("Upload error: ", error);
      onError(error);
    }
  };

  const handleDesignFeeChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { // Only allow integers
      setDesignFee(value);
      setFormattedDesignFee(formatCurrency(value));
    }
  };


  const handleUploadEquipmentFile = async ({ file, onSuccess, onError }) => {
    setUploadedEquipmentFileURL(file);
    onSuccess(null, file);
  };

  const handleDownloadEquipmentFile = async () => {
    setLoading(true);
    await dispatch(DownloadEquipmentFileActionAsync(taskDetail.agencyId));
    setLoading(false);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <LoadingWrapper>
          <Spin size="large" />
        </LoadingWrapper>
      );
    }

    return (
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <StyledCard
          title="Nội dung báo cáo"
          extra={
            taskDetail.status === "None" && taskDetail.submit === "None" && (
              <Button type="primary" icon={<EditOutlined />} onClick={handleEditReport}>
                Chỉnh sửa
              </Button>
            )
          }
        >
          {isEditing ? (
            <Form form={form} layout="vertical">
              <Form.Item
                name="report"
                label="Báo cáo"
                rules={[
                  { required: true, message: 'Vui lòng nhập báo cáo' },
                  { max: 10000, message: 'Báo cáo không được vượt quá 10000 chữ' }
                ]}
              >
                <ReactQuill
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Nhập báo cáo công việc"
                  style={{ minHeight: '200px' }}
                />
              </Form.Item>
              <Form.Item
                name="reportImageURL"
                label={taskType === "Design" ? "File thiết kế" : "File đính kèm"}
              >
                <Upload
                  name="reportFile"
                  customRequest={handleUpload}
                  accept="*"
                  maxCount={1}
                  defaultFileList={taskDetail.reportImageURL ? [{
                    uid: '-1',
                    name: 'Tệp đính kèm hiện tại',
                    status: 'done',
                    url: taskDetail.reportImageURL,
                  }] : []}
                >
                  <Button icon={<UploadOutlined />}>
                    {taskDetail.reportImageURL ? "Tải file khác" : "Tải file"}
                  </Button>
                </Upload>
              </Form.Item>
              {/* {taskType === "Design" && (
                <Form.Item
                  name="equipmentFileURL"
                  label="File trang thiết bị"
                >
                  <Upload
                    name="equipmentFile"
                    customRequest={handleUploadEquipmentFile}
                    accept=".xls,.xlsx"
                    maxCount={1}
                    defaultFileList={taskDetail.equipmentFileURL ? [{
                      uid: '-1',
                      name: 'Tệp trang thiết bị hiện tại',
                      status: 'done',
                      url: taskDetail.equipmentFileURL,
                    }] : []}
                  >
                    <Button icon={<UploadOutlined />}>
                      {taskDetail.equipmentFileURL ? "Tải file khác" : "Tải file"}
                    </Button>
                  </Upload>
                </Form.Item>
              )} */}
              {taskType === "Design" && (
                <>
                  <Form.Item
                    name="designFee"
                    label="Giá tiền thiết kế"
                    rules={[{ pattern: /^\d+$/, message: "Vui lòng nhập số nguyên" }]}
                  >
                    <Input type="text" onChange={handleDesignFeeChange} placeholder="Ví dụ 5 triệu đồng: 5000000" />
                    {formattedDesignFee && (
                      <Form.Item style={{ marginBottom: 0 }}>
                        <Text type="secondary">Giá tiền thiết kế: {formattedDesignFee}</Text>
                      </Form.Item>
                    )}
                  </Form.Item>
                  <Form.Item
                    name="equipmentFileURL"
                    label="File trang thiết bị"
                  >
                    <Upload
                      name="equipmentFile"
                      customRequest={handleUploadEquipmentFile}
                      accept=".xls,.xlsx"
                      maxCount={1}
                      defaultFileList={taskDetail.equipmentFileURL ? [{
                        uid: '-1',
                        name: 'Tệp trang thiết bị hiện tại',
                        status: 'done',
                        url: taskDetail.equipmentFileURL,
                      }] : []}
                    >
                      <Button icon={<UploadOutlined />}>
                        {taskDetail.equipmentFileURL ? "Thêm file khác" : "Thêm file"}
                      </Button>
                    </Upload>
                  </Form.Item>
                </>
              )}
              <ButtonGroup>
                <Button onClick={() => setIsEditing(false)}>Hủy</Button>
                <Button type="primary" onClick={handleSaveReport}>Lưu</Button>
              </ButtonGroup>
            </Form>
          ) : (
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <HTMLContent dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(taskDetail.report) }} />
              {taskType === "Design" && formattedDesignFee && (
                <Text type="secondary" style={{ marginTop: '16px' }}>
                  Giá tiền thiết kế: {formattedDesignFee}
                </Text>
              )}
              {taskDetail.reportImageURL && (
                <Button
                  type="primary"
                  icon={<FilePdfOutlined />}
                  href={taskDetail.reportImageURL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Xem tài liệu đính kèm
                </Button>
              )}
              {taskType === "Design" && (
                <Button
                  type="primary"
                  icon={<FilePdfOutlined />}
                  onClick={handleDownloadEquipmentFile}
                >
                  Xuất file trang thiết bị
                </Button>
              )}
            </Space>
          )}
        </StyledCard>
      </Space>
    );
  };

  return (
    <StyledModal
      title={<Title level={3}>Chi tiết báo cáo</Title>}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose} size="large">
          Đóng
        </Button>
      ]}
      width={800}
    >
      {renderContent()}
    </StyledModal>
  );
};

export default ShowReportModal;

