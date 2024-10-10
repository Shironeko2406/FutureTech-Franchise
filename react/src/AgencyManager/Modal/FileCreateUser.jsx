import React, { useState } from "react";
import { Modal, Form, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { CreateUserUploadFileActionAsync } from "../../Redux/ReducerAPI/UserReducer";

const FileCreateUser = ({ open, onCancel }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const dispatch = useDispatch();

  const handleUpload = ({ file, onSuccess, onError }) => {
    // Giả sử upload thành công
    setTimeout(() => {
      onSuccess(file);
    }, 1000);
  };

  const handleChange = ({ fileList }) => {
    setFileList(fileList); // Cập nhật danh sách file khi thay đổi
  };

  const handleSubmit = async () => {
    const file = fileList[0]?.originFileObj;
    const fileData = new FormData();

    // Đính kèm file vào form data
    fileData.append("file", file);

    // Dispatch action và kiểm tra kết quả trả về
    const result = await dispatch(CreateUserUploadFileActionAsync(fileData));

    if (result === true) {
      // Nếu dispatch thành công thì reset form
      form.resetFields();
      setFileList([]); // Reset file list
      onCancel(); // Đóng modal sau khi reset
    } else {
      message.error("Lỗi file");
    }
  };

  return (
    <Modal
      title="Tạo File Người Dùng"
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Thêm
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="file"
          label="Upload File Excel"
          rules={[{ required: true, message: "Vui lòng tải lên file" }]}
        >
          <Upload
            accept=".xlsx"
            fileList={fileList}
            maxCount={1}
            onChange={handleChange}
            customRequest={handleUpload}
          >
            <Button icon={<UploadOutlined />}>Chọn file</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FileCreateUser;
