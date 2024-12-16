import { Table, Button, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetClassesActionAsync } from "../../../Redux/ReducerAPI/ClassReducer";
import { RightCircleOutlined, PlusOutlined } from "@ant-design/icons"; // Import the PlusOutlined icon
import { useNavigate } from "react-router-dom";
import { UpdateClassStatusActionAsync } from "../../../Redux/ReducerAPI/ClassReducer";
import CreateClassModal from "../../Modal/CreateClassModal"; // Import the new modal component

const { Text } = Typography;

const ClassManagement = () => {
    const { classes, totalPagesCount } = useSelector((state) => state.ClassReducer);
    const dispatch = useDispatch();
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false); // State for modal visibility
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        dispatch(GetClassesActionAsync(pageIndex, pageSize)).finally(() => setLoading(false));
    }, [dispatch, pageIndex, pageSize]);

    const handleTableChange = (pagination) => {
        setPageIndex(pagination.current);
        setPageSize(pagination.pageSize);
    };

    const handleRowClick = (id) => {
        navigate(`/agency-manager/classes/${id}`);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            Active: {
                text: 'Hoạt động',
                color: '#52c41a',
                backgroundColor: '#e6fffb',
                borderColor: '#b7eb8f'
            },
            Inactive: {
                text: 'Không hoạt động',
                color: '#ff4d4f',
                backgroundColor: '#fff2f0',
                borderColor: '#ffa39e'
            }
        };

        const config = statusConfig[status] || statusConfig.Inactive;

        return (
            <div
                style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '6px',
                    backgroundColor: config.backgroundColor,
                    border: `1px solid ${config.borderColor}`,
                }}
            >
                <Text strong style={{ color: config.color }}>
                    {config.text}
                </Text>
            </div>

        );
    };

    const handleStatusUpdate = async (id, currentStatus) => {
        const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
        setLoading(true);
        dispatch(UpdateClassStatusActionAsync(id, newStatus))
            .then(() => dispatch(GetClassesActionAsync(pageIndex, pageSize)))
            .finally(
                setLoading(false)
            );
    };

    const handleCreateClassClick = () => {
        setIsCreateModalVisible(true);
    };

    const handleCreateClassClose = () => {
        setIsCreateModalVisible(false);
        dispatch(GetClassesActionAsync(pageIndex, pageSize)); // Refresh the class list
    };

    const columns = [
        {
            title: "No",
            dataIndex: "no",
            key: "no",
            align: "center",
            render: (text, record, index) => index + 1 + (pageIndex - 1) * pageSize,
        },
        {
            title: "Tên lớp",
            dataIndex: "name",
            key: "name",
            align: "center",
            render: (text, record) => (
                <Button
                    type="link"
                    onClick={() => handleRowClick(record.id)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 8px',
                        height: 'auto',
                        fontSize: '14px',
                        transition: 'all 0.3s ease'
                    }}
                    className="hover:bg-blue-50"
                >
                    <Text strong style={{ marginRight: '4px' }}>{text}</Text>
                    <RightCircleOutlined style={{ fontSize: '16px' }} />
                </Button>
            ),
        },
        {
            title: "Sức chứa",
            dataIndex: "capacity",
            key: "capacity",
            align: "center",
        },
        {
            title: "SL hiện tại",
            dataIndex: "currentEnrollment",
            key: "currentEnrollment",
            align: "center",
            render: (text, record) => (
                <Text
                    style={{
                        color: record.currentEnrollment >= record.capacity ? '#ff4d4f' : '#52c41a'
                    }}
                    strong
                >
                    {text}
                </Text>
            ),
        },
        {
            title: "Tên khóa",
            dataIndex: "courseName",
            key: "courseName",
            align: "center",
        },
        {
            title: "Tình trạng",
            dataIndex: "status",
            key: "status",
            align: "center",
            render: getStatusBadge,
        },
        {
            title: "Đổi trạng thái lớp học",
            key: "action",
            align: "center",
            render: (text, record) => (
                <Button
                    type="primary"
                    onClick={() => handleStatusUpdate(record.id, record.status)}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                    {record.status === "Active" ? "Không hoạt động" : "Hoạt động"}
                </Button>
            ),
        },
    ];

    return (
        <div className="card">
            <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h5 className="card-title mb-0">Danh Sách Lớp Học</h5>
                    <Button type="primary" onClick={handleCreateClassClick} icon={<PlusOutlined />}>
                        Thêm mới lớp học
                    </Button>
                </div>
                <Table
                    bordered
                    columns={columns}
                    dataSource={classes}
                    rowKey={(record) => record.id}
                    pagination={{
                        current: pageIndex,
                        pageSize,
                        total: totalPagesCount * pageSize,
                        showSizeChanger: true,
                        pageSizeOptions: ["10", "20", "50"],
                    }}
                    loading={loading}
                    onChange={handleTableChange}
                    style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        overflow: 'hidden'
                    }}
                />
            </div>
            <CreateClassModal visible={isCreateModalVisible} onClose={handleCreateClassClose} />
        </div>
    );
};

export default ClassManagement;