// import { Form, Input, Button, Typography, Card, Space } from "antd";
// import { UserOutlined } from "@ant-design/icons";
// import { useDispatch } from "react-redux";
// import { OtpEmailActionAsync } from "../../../Redux/ReducerAPI/AuthenticationReducer";
// import { NavLink, useNavigate } from "react-router-dom";

// const { Title } = Typography;

// const ForgotPassword = () => {
//   const [form] = Form.useForm();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const onFinish = (values) => {
//     dispatch(OtpEmailActionAsync(values))
//       .then((response) => {
//         if (response)
//           navigate(`/forgot-password/reset-password?username=${(values.username)}`);
//       })
//       .catch((error) => {
//         console.error(error);
//         // Handle errors or show error messages
//       });
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         height: "100vh",
//         backgroundColor: "#f0f2f5",
//       }}
//     >
//       <Card
//         style={{
//           width: 400,
//           borderRadius: 8,
//           boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//           padding: "20px",
//         }}
//         title={
//           <Title level={3} style={{ textAlign: "center" }}>
//             Forgot Password
//           </Title>
//         }
//       >
//         <Form
//           form={form}
//           name="forgot_password"
//           onFinish={onFinish}
//           layout="vertical"
//         >
//           <Form.Item
//             name="username"
//             label="Username"
//             style={{ marginBottom: "16px" }}
//             rules={[
//               {
//                 required: true,
//                 message: "Please input your username!",
//               },
//             ]}
//           >
//             <Input
//               prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
//               placeholder="Enter your username"
//               style={{ borderRadius: "4px" }}
//             />
//           </Form.Item>
//           <Form.Item>
//             <Button
//               type="primary"
//               htmlType="submit"
//               block
//               style={{ borderRadius: "4px", fontWeight: "bold" }}
//             >
//               Submit
//             </Button>
//           </Form.Item>
//           <Form.Item>
//             <Space style={{ width: "100%", justifyContent: "space-between" }}>
//               <NavLink to="/">
//                 Back to Login
//               </NavLink>
//             </Space>
//           </Form.Item>
//         </Form>
//       </Card>
//     </div>
//   );
// };

// export default ForgotPassword;

import { Form, Input, Button, Typography, Card, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { OtpEmailActionAsync } from "../../../Redux/ReducerAPI/AuthenticationReducer";
import { NavLink, useNavigate } from "react-router-dom";
import { useFormik } from "formik";

const { Title } = Typography;

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useFormik({
    initialValues: {
      username: "",
    },
    onSubmit: (values) => {
      dispatch(OtpEmailActionAsync(values))
        .then((response) => {
          if (response) {
            navigate(
              `/forgot-password/reset-password?username=${values.username}`
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  });

  return (
    <div
      className="page-wrapper"
      id="main-wrapper"
      data-layout="vertical"
      data-navbarbg="skin6"
      data-sidebartype="full"
      data-sidebar-position="fixed"
      data-header-position="fixed"
    >
      <div className="position-relative overflow-hidden radial-gradient min-vh-100 d-flex align-items-center justify-content-center">
        <div className="d-flex align-items-center justify-content-center w-100">
          <div className="row justify-content-center w-100">
            <div className="col-md-8 col-lg-6 col-xxl-4">
              <div className="card mb-0">
                <div className="card-body">
                  <NavLink
                    to="/"
                    className="text-nowrap logo-img text-center d-block py-3 w-100"
                  >
                    <img src="/assets/images/logos/logo-light.svg" />
                  </NavLink>
                  <p className="text-center">Lấy lại mật khẩu</p>
                  <form onSubmit={user.handleSubmit}>
                    <div className="mb-4">
                      <label
                        htmlFor="exampleInputEmail1"
                        className="form-label"
                      >
                        Tên người dùng
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        name="username"
                        onChange={user.handleChange}
                        value={user.values.username}
                      />
                    </div>

                    <button
                      className="btn btn-primary w-100 py-8 fs-4 mb-4"
                      type="submit"
                    >
                      Quên mật khẩu
                    </button>
                    <div className="d-flex align-items-center justify-content-center">
                      <p className="fs-4 mb-0 fw-bold">New to SeoDash?</p>
                      <NavLink className="text-primary fw-bold ms-2" to="/">
                        Trở lại
                      </NavLink>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
