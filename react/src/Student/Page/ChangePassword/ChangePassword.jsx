import { useDispatch } from "react-redux";
import { Form, Input, Button, Typography, Space, Layout } from 'antd';
import { LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { ChangePasswordActionAsync } from '../../../Redux/ReducerAPI/UserReducer';

const { Title } = Typography;
const { Content } = Layout;

export default function ChangePassword() {
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const onFinish = async (values) => {
        dispatch(ChangePasswordActionAsync(values))
            .then((response) => {
                if (response) form.resetFields();
            })
            .catch((error) => {
                console.error("Failed to change password:", error);
                // Handle errors or show error messages
            });
    };

    return (
        <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
            <Content style={{ padding: '50px 16px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Title level={2} style={{ margin: 0, textAlign: 'center', fontSize: '28px' }}>Thay đổi mật khẩu</Title>

                    <Form
                        form={form}
                        name="change_password"
                        onFinish={onFinish}
                        layout="vertical"
                        validateTrigger="onBlur"
                        requiredMark={false}
                        style={{ background: '#fff', padding: '50px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: '16px' }}
                    >
                        <Form.Item
                            name="oldPassword"
                            label={<span style={{ fontSize: '18px' }}>Mật khẩu hiện tại</span>}
                            labelCol={{ style: { fontSize: '20px', height: 'auto', marginBottom: '8px' } }}
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                placeholder="Nhập mật khẩu hiện tại"
                                size="large"
                                style={{ fontSize: '16px', padding: '12px 11px' }}
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                        </Form.Item>

                        <Form.Item
                            name="newPassword"
                            label={<span style={{ fontSize: '18px' }}>Mật khẩu mới</span>}
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                                {
                                    pattern: /^(?=.*[a-zA-Z])(?=.*\d).+$/,
                                    message:
                                        "Mật khẩu phải có ít nhất một ký tự chữ và số!",
                                },
                            ]}
                            labelCol={{ style: { fontSize: '18px', height: 'auto', marginBottom: '8px' } }}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                placeholder="Nhập mật khẩu mới"
                                size="large"
                                style={{ fontSize: '16px', padding: '12px 11px' }}
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            label={<span style={{ fontSize: '18px' }}>Xác nhận mật khẩu mới</span>}
                            dependencies={['newPassword']}
                            rules={[
                                { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Hai mật khẩu bạn đã nhập không khớp!'));
                                    },
                                }),
                            ]}
                            labelCol={{ style: { fontSize: '18px', height: 'auto', marginBottom: '8px' } }}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                placeholder="Xác nhận mật khẩu mới"
                                size="large"
                                style={{ fontSize: '16px', padding: '12px 11px' }}
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                style={{ width: '100%', height: '54px', fontSize: '18px' }}
                            >
                                Thay đổi mật khẩu
                            </Button>
                        </Form.Item>
                    </Form>
                </Space>
            </Content>
        </Layout>
    );
}