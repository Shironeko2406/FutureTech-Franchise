import { Button, Table, Dropdown, Space, Typography, Input, Modal, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { EditOutlined, DeleteOutlined, SearchOutlined, EllipsisOutlined, DownloadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { GetDocumentsActionAsync, DeleteDocumentActionAsync } from "../../../Redux/ReducerAPI/DocumentReducer";
import { useLoading } from "../../../Utils/LoadingContext";

const { Text } = Typography;

const DocumentManagement = () => {
    const { documents, totalPagesCount } = useSelector((state) => state.DocumentReducer);
    const dispatch = useDispatch();
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [type, setType] = useState(null);
    const [status, setStatus] = useState(null);
    const { setLoading } = useLoading();

    useEffect(() => {
        setLoading(true);
        dispatch(GetDocumentsActionAsync({ pageIndex, pageSize, type, status }))
            .finally(() => setLoading(false));
    }, [dispatch, pageIndex, pageSize, type, status]);

    const handleTableChange = (pagination, filters) => {
        setPageIndex(pagination.current);
        setPageSize(pagination.pageSize);
        setType(filters.type ? filters.type[0] : null);
        setStatus(filters.status ? filters.status[0] : null);
    };

    const handleDelete = async (documentId) => {
        setLoading(true);
        try {
            await dispatch(DeleteDocumentActionAsync(documentId));
            await dispatch(GetDocumentsActionAsync(pageIndex, pageSize, type, status));
        } finally {
            setLoading(false);
        }
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    placeholder={`Tìm kiếm ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: "block" }}
                />
                <Button
                    type="primary"
                    onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    icon={<SearchOutlined />}
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    Tìm kiếm
                </Button>
                <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                    Xóa lọc
                </Button>
            </div>
        ),
        filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    });

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        if (dataIndex === "type") {
            setType(selectedKeys[0]);
        } else if (dataIndex === "status") {
            setStatus(selectedKeys[0]);
        }
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setType(null);
        setStatus(null);
    };

    const renderStatusBadge = (status) => {
        const statusConfig = {
            Active: {
                text: "Hoạt động",
                color: "green",
                backgroundColor: "#f6ffed",
                borderColor: "#b7eb8f",
            },
            Expired: {
                text: "Hết hạn",
                color: "red",
                backgroundColor: "#fff2f0",
                borderColor: "#ffa39e",
            },
        };

        const config = statusConfig[status] || statusConfig.Active;

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

    const renderTypeBadge = (type) => {
        const typeConfig = {
            AgreementContract: "Hợp đồng thỏa thuận",
            BusinessLicense: "Giấy phép kinh doanh",
            EducationalOperationLicense: "Giấy phép hoạt động giáo dục",
        };

        return typeConfig[type] || typeConfig.AgreementContract;
    };

    const getActionItems = () => [
        {
            label: "Sửa",
            key: "edit",
            icon: <EditOutlined style={{ color: "#faad14" }} />,
        },
        {
            label: "Xóa",
            key: "delete",
            icon: <DeleteOutlined style={{ color: "red" }} />,
        },
    ];

    const handleMenuClick = async (record, key) => {
        if (key === "edit") {
            // Handle edit action
        } else if (key === "delete") {
            Modal.confirm({
                title: "Bạn có chắc chắn muốn xóa tài liệu này?",
                content: "Hành động này không thể hoàn tác.",
                okText: "Xóa",
                okType: "danger",
                cancelText: "Hủy",
                onOk: async () => {
                    await handleDelete(record.id);
                },
            });
        }
    };

    const columns = [
        {
            title: "Tên tài liệu",
            dataIndex: "title",
            key: "title",
            align: "center",
            ...getColumnSearchProps("title"),
        },
        {
            title: "Loại tài liệu",
            dataIndex: "type",
            key: "type",
            align: "center",
            filters: [
                { text: "Hợp đồng thỏa thuận", value: "AgreementContract" },
                { text: "Giấy phép kinh doanh", value: "BusinessLicense" },
                { text: "Giấy phép hoạt động giáo dục", value: "EducationalOperationLicense" },
            ],
            filterMultiple: false,
            render: (type) => renderTypeBadge(type),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            align: "center",
            filters: [
                { text: "Hoạt động", value: "Active" },
                { text: "Hết hạn", value: "Expired" },
            ],
            filterMultiple: false,
            render: (status) => renderStatusBadge(status),
        },
        {
            title: "Hành động",
            key: "action",
            align: "center",
            render: (_, record) => (
                <Space>
                    <Dropdown
                        menu={{
                            items: getActionItems(),
                            onClick: ({ key }) => handleMenuClick(record, key),
                        }}
                    >
                        <Button
                            type="primary"
                            icon={<EllipsisOutlined />}
                            style={{ backgroundColor: "#50e3c2", color: "#0A5A5A" }}
                        />
                    </Dropdown>
                    <Tooltip title="Tải xuống file tài liệu">
                        <Button
                            type="primary"
                            icon={<DownloadOutlined />}
                            onClick={() => window.open(record.urlFile, "_blank")}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title mb-3">Quản lý tài liệu</h5>
                <Table
                    bordered
                    columns={columns}
                    dataSource={documents}
                    rowKey={(record) => record.id}
                    pagination={{
                        current: pageIndex,
                        pageSize,
                        total: totalPagesCount * pageSize,
                        showSizeChanger: true,
                        pageSizeOptions: ["10", "20", "50"],
                    }}
                    onChange={handleTableChange}
                />
            </div>
        </div>
    );
};

export default DocumentManagement;