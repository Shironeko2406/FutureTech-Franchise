import React from 'react';
import { Modal, Form, Select, Button, Space } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

const AddClassModal = ({ visible, onCancel, onOk }) => {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        onOk(values);
        form.resetFields();
    };

    return (
        <Modal
            title="Thêm lịch học"
            open={visible}
            onCancel={onCancel}
            onOk={() => form.submit()}
            okText="OK"
            cancelText="Cancel"
        >
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    name="class"
                    label="Chọn lớp học"
                    rules={[{ required: true, message: 'Vui lòng chọn lớp học' }]}
                >
                    <Select placeholder="Vui lòng chọn lớp học">
                        <Option value="class1">Class 1</Option>
                        <Option value="class2">Class 2</Option>
                        <Option value="class3">Class 3</Option>
                    </Select>
                </Form.Item>

                <Form.List name="slots">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map((field, index) => (
                                <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                    <Form.Item
                                        {...field}
                                        label={`Slot học ${index + 1}`}
                                        name={[field.name, 'slot']}
                                        rules={[{ required: true, message: 'Vui lòng chọn slot học' }]}
                                    >
                                        <Select style={{ width: 200 }}>
                                            <Option value="slot1">Slot 1</Option>
                                            <Option value="slot2">Slot 2</Option>
                                            <Option value="slot3">Slot 3</Option>
                                            <Option value="slot4">Slot 4</Option>
                                            <Option value="slot5">Slot 5</Option>
                                            <Option value="slot6">Slot 6</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        {...field}
                                        label="Ngày học"
                                        name={[field.name, 'day']}
                                        rules={[{ required: true, message: 'Vui lòng chọn ngày học' }]}
                                    >
                                        <Select style={{ width: 200 }}>
                                            <Option value="MON">MON</Option>
                                            <Option value="TUE">TUE</Option>
                                            <Option value="WED">WED</Option>
                                            <Option value="THU">THU</Option>
                                            <Option value="FRI">FRI</Option>
                                            <Option value="SAT">SAT</Option>
                                            <Option value="SUN">SUN</Option>
                                        </Select>
                                    </Form.Item>
                                    {fields.length > 1 && (
                                        <MinusCircleOutlined onClick={() => remove(field.name)} />
                                    )}
                                </Space>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    Thêm slot học
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Form>
        </Modal>
    );
};

export default AddClassModal;