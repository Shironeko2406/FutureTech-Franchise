import React, { useEffect, useState } from "react";
import { Button, Modal, Select, Form, Input, Typography, Card, Row, Col, Divider } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { GetAvailableClassesByCourseIdActionAsync, AddStudentsToClassActionAsync } from "../../Redux/ReducerAPI/ClassReducer";
import { useLoading } from '../../Utils/LoadingContext';
import moment from 'moment';

const { Title, Text } = Typography;

const AddToClassWithoutCreateModal = ({ visible, onClose, studentId, courseId, isTransfer }) => {
    const dispatch = useDispatch();
    const [selectedClass, setSelectedClass] = useState(null);
    const { setLoading } = useLoading();
    const { availableClasses } = useSelector((state) => state.ClassReducer);

    useEffect(() => {
        if (visible) {
            dispatch(GetAvailableClassesByCourseIdActionAsync(courseId));
        }
    }, [visible, dispatch, courseId]);

    const handleClassSelect = (classId) => {
        setSelectedClass(classId);
    };

    const handleConfirm = async () => {
        if (selectedClass) {
            setLoading(true);
            try {
                await dispatch(AddStudentsToClassActionAsync(selectedClass, [studentId]));
                onClose();
            } catch (error) {
                console.error("Error adding student to class: ", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const selectedClassData = availableClasses.find(cls => cls.id === selectedClass);

    return (
        <Modal
            open={visible}
            title={isTransfer ? "Chuyển lớp cho học sinh" : "Thêm học sinh vào lớp"}
            onCancel={onClose}
            footer={[
                <Button key="back" onClick={onClose}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" onClick={handleConfirm}>
                    Xác nhận
                </Button>,
            ]}
        >
            <Form layout="vertical mt-4">
                <Form.Item label="Chọn lớp học hiện có">
                    <Select
                        onChange={handleClassSelect}
                        style={{ width: "100%" }}
                    >
                        {availableClasses.length === 0 ? (
                            <Select.Option disabled>Hiện tại chưa có lớp</Select.Option>
                        ) : (
                            availableClasses.map((cls) => (
                                <Select.Option key={cls.id} value={cls.id}>
                                    {cls.dayOfWeek ? `${cls.name} - ${cls.dayOfWeek}` : `${cls.name} - Chưa có lịch học`}
                                </Select.Option>
                            ))
                        )}
                    </Select>
                </Form.Item>
                {selectedClass && selectedClassData && (
                    <Card
                        className="mt-4"
                        style={{ backgroundColor: '#f0f2f5', borderRadius: 8 }}
                    >
                        <Title level={4} style={{ marginBottom: 16 }}>Thông tin lớp học</Title>
                        <Divider style={{ margin: '12px 0' }} />
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <InfoItem label="Tên lớp" value={selectedClassData.name} />
                            </Col>
                            <Col span={12}>
                                <InfoItem label="Giảng viên" value={selectedClassData.instructorName} />
                            </Col>
                            <Col span={12}>
                                <InfoItem label="Sức chứa" value={`${selectedClassData.capacity} học viên`} />
                            </Col>
                            <Col span={12}>
                                <InfoItem label="Số người đang học" value={`${selectedClassData.currentEnrollment} học viên`} />
                            </Col>
                            <Col span={12}>
                                <InfoItem label="Ngày bắt đầu" value={moment(selectedClassData.startDate).format('DD/MM/YYYY')} />
                            </Col>
                            <Col span={12}>
                                <InfoItem label="Số buổi đã học" value={`${selectedClassData.daysElapsed} buổi`} />
                            </Col>
                        </Row>
                    </Card>
                )}
            </Form>
        </Modal>
    );
};

const InfoItem = ({ label, value }) => (
    <div style={{ marginBottom: 8 }}>
        <Text type="secondary" style={{ marginRight: 8 }}>{label}:</Text>
        <Text strong>{value}</Text>
    </div>
);

export default AddToClassWithoutCreateModal;