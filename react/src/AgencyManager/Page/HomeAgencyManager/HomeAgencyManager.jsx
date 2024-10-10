import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Upload,
  Typography,
  Select,
  DatePicker,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { imageDB } from "../../../Firebasse/Config";
import { useDispatch } from "react-redux";
import { CreateUserActionAsync } from "../../../Redux/ReducerAPI/UserReducer";
import FileCreateUser from "../../Modal/FileCreateUser";

const HomeAgencyManager = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [fileList, setFileList] = useState([]); // Thêm state cho fileList
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const handleUpload = ({ file, onSuccess, onError }) => {
    const storageRef = ref(imageDB, `images/${file.name}`); // Create reference to Firebase Storage
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        // If there's an error during upload
        message.error("Upload failed!");
        console.error(error);
        onError(error); // Notify Ant Design Upload component of the error
      },
      async () => {
        // If upload is successful
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImageUrl(downloadURL); // Save the image URL
          message.success("Upload successful!");
          onSuccess(null, file); // Notify Ant Design Upload component that upload was successful
        } catch (err) {
          message.error("Failed to retrieve image URL.");
          console.error(err);
          onError(err); // Notify Ant Design Upload component of the error
        }
      }
    );
  };

  const handleChange = ({ fileList }) => {
    setFileList(fileList); // Cập nhật danh sách file khi thay đổi
  };

  // Function to show the modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Function to handle closing the modal
  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  // Hàm xử lý khi form được submit
  const onFinish = async (values) => {
    const user = {
      ...values,
      dateOfBirth: values["dateOfBirth"].format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
      urlImage: imageUrl,
      role: "Student",
    };
    const result = await dispatch(CreateUserActionAsync(user));
    if (result === true) {
      form.resetFields(); // Reset form sau khi tạo thành công
      setFileList([]); // Reset danh sách file upload
      setImageUrl(""); // Reset URL ảnh
    } else {
      message.error("Failed to create user.");
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="card-title">Tạo người dùng</h5>
            <button
              type="button"
              className="btn btn-success"
              onClick={showModal}
            >
              Thêm file
            </button>
          </div>

          <div>
            <Form
              layout="vertical"
              form={form}
              name="create-user"
              autoComplete="off"
              onFinish={onFinish}
            >
              <Row gutter={24}>
                {/* Name */}
                <Col xs={24}>
                  <Form.Item
                    label="Họ và Tên"
                    name="fullName"
                    rules={[
                      { required: true, message: "Vui lòng nhập họ tên!" },
                    ]}
                  >
                    <Input placeholder="Nhập tên người đăng ký" size="large" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                {/* Date of Birth */}
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Ngày sinh"
                    name="dateOfBirth"
                    rules={[
                      { required: true, message: "Vui lòng chọn ngày sinh!" },
                    ]}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      placeholder="Chọn ngày sinh"
                      size="large"
                      format="DD-MM-YYYY"
                    />
                  </Form.Item>
                </Col>

                {/* Gender */}
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Giới tính"
                    name="gender"
                    rules={[
                      { required: true, message: "Vui lòng chọn giới tính!" },
                    ]}
                  >
                    <Select placeholder="Chọn giới tính" size="large">
                      <Select.Option value="Nam">Nam</Select.Option>
                      <Select.Option value="Nữ">Nữ</Select.Option>
                      <Select.Option value="Khác">Khác</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                {/* Address */}
                <Col xs={24}>
                  <Form.Item
                    label="Địa chỉ"
                    name="address"
                    rules={[
                      { required: true, message: "Vui lòng nhập địa chỉ!" },
                    ]}
                  >
                    <Input placeholder="Nhập địa chỉ" size="large" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                {/* Position Image URL */}
                <Col xs={24}>
                  <Form.Item
                    label="Hình đại diện"
                    name="urlImage"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng tải lên hình đại diện!",
                      },
                    ]}
                  >
                    <Upload
                      name="urlImage"
                      listType="picture"
                      maxCount={1}
                      customRequest={handleUpload}
                      fileList={fileList} // Liên kết với state fileList
                      onChange={handleChange} // Thêm sự kiện onChange
                    >
                      <Button icon={<UploadOutlined />}>Upload Image</Button>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                {/* Phone Number */}
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Điện thoại"
                    name="phoneNumber"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số điện thoại!",
                      },
                      {
                        pattern: /^[0-9]+$/,
                        message: "Số điện thoại chỉ được chứa số!",
                      },
                    ]}
                  >
                    <Input
                      type="tel"
                      placeholder="Nhập số điện thoại của bạn"
                      size="large"
                      maxLength={11}
                    />
                  </Form.Item>
                </Col>

                {/* Email */}
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Vui lòng nhập email!" },
                      { type: "email", message: "Email không hợp lệ!" },
                    ]}
                  >
                    <Input placeholder="Enter your email" size="large" />
                  </Form.Item>
                </Col>
              </Row>

              {/* Submit Button */}
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  style={{ width: "100%", marginTop: "20px" }}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
      <FileCreateUser
        open={isModalVisible}
        onCancel={handleModalCancel}
      ></FileCreateUser>
    </div>
  );
};

export default HomeAgencyManager;
