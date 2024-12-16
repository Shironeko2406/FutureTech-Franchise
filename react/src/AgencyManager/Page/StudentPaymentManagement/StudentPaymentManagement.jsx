import { Space, Table, Input, Button, Modal, Typography, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";
import { GetStudentPaymentInfoActionAsync } from "../../../Redux/ReducerAPI/PaymentReducer";
import moment from "moment";
import { useLoading } from "../../../Utils/LoadingContext";

const { Text } = Typography;

const StudentPaymentManagement = () => {
    const { paymentInfo, totalPagesCount } = useSelector((state) => state.PaymentReducer);
    const dispatch = useDispatch();
    const { setLoading } = useLoading();
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchName, setSearchName] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isImageLoading, setIsImageLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        dispatch(GetStudentPaymentInfoActionAsync(pageIndex, pageSize, searchName))
            .finally(() => setLoading(false));
    }, [pageIndex, pageSize, searchName, dispatch]);

    const handlePageChange = (page, pageSize) => {
        setPageIndex(page);
        setPageSize(pageSize);
    };

    const handleSearch = (value) => {
        setSearchName(value);
    };

    const handleImageClick = (imageURL) => {
        setSelectedImage(imageURL);
        setIsImageLoading(true); // Hiển thị spinner
        setIsModalVisible(true);
    };

    const handleImageLoad = () => {
        setIsImageLoading(false); // Tắt spinner khi ảnh tải xong
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedImage(null);
    };

    const renderMethodBadge = (method) => {
        const methodMapping = {
            BankTransfer: {
                text: "Chuyển khoản",
                color: '#3498db',
                backgroundColor: '#e6f7ff',
                borderColor: '#91d5ff'
            },
            Direct: {
                text: "Trực tiếp",
                color: 'orange',
                backgroundColor: '#fff7e6',
                borderColor: '#ffd591'
            }
        };

        const config = methodMapping[method] || methodMapping.Direct;

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

    const columns = [
        {
            title: "No",
            dataIndex: "no",
            key: "no",
            render: (text, record, index) => index + 1 + (pageIndex - 1) * pageSize,
        },
        {
            title: "Tiêu đề",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Tên học viên",
            dataIndex: "studentName",
            key: "studentName",
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Số tiền (VNĐ)",
            dataIndex: "amount",
            key: "amount",
            render: (amount) => amount.toLocaleString("vi-VN"), // Định dạng số tiền
        },
        {
            title: "Phương thức",
            dataIndex: "method",
            key: "method",
            render: (text) => renderMethodBadge(text),
        },
        {
            title: "Thời gian thanh toán",
            dataIndex: "dateTime",
            key: "dateTime",
            render: (dateTime) => moment(dateTime).format("DD/MM/YYYY HH:mm"), // Định dạng ngày giờ
        },
        {
            title: "Hình ảnh",
            dataIndex: "imageURL",
            key: "imageURL",
            render: (text) =>
                text ? (
                    <Button type="link" onClick={() => handleImageClick(text)}>
                        Xem ảnh
                    </Button>
                ) : null,
        },
    ];

    return (
        <div>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title mb-3">Thông Tin Thanh Toán</h5>
                    <Space style={{ marginBottom: 16 }}>
                        <span style={{ marginRight: 8 }}>Tìm kiếm:</span>
                        <Input.Search
                            placeholder="Nhập tên học viên"
                            onSearch={handleSearch}
                            style={{ width: 360 }}
                            enterButton={<SearchOutlined />}
                        />
                    </Space>
                    <Table
                        bordered
                        columns={columns}
                        dataSource={paymentInfo}
                        rowKey={(record) => record.id}
                        pagination={{
                            current: pageIndex,
                            pageSize,
                            total: totalPagesCount * pageSize,
                            onChange: handlePageChange,
                            showSizeChanger: true,
                            pageSizeOptions: ["10", "20", "50"],
                        }}
                        scroll={{ x: 'max-content' }}
                    />
                    <Modal
                        open={isModalVisible}
                        footer={null}
                        onCancel={handleModalClose}
                    >
                        {isImageLoading ? (
                            <Spin tip="Đang tải ảnh..." />
                        ) : (
                            <img
                                src={selectedImage}
                                alt="ảnh thanh toán"
                                style={{ width: "100%" }}
                                onLoad={handleImageLoad}
                            />
                        )}
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default StudentPaymentManagement;
