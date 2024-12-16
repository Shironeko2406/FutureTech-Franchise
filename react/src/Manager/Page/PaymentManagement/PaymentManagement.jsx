import React, { useEffect, useState } from "react";
import { Button, Table, Space, Typography, Spin, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { GetPaymentContractsActionAsync } from "../../../Redux/ReducerAPI/PaymentReducer";
import moment from "moment";
import { useLoading } from "../../../Utils/LoadingContext";

const { Text } = Typography;

const PaymentManagement = () => {
    const { paymentInfo, totalPagesCount } = useSelector((state) => state.PaymentReducer);
    const dispatch = useDispatch();
    const { setLoading } = useLoading();
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10); // Default page size is 10
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isImageLoading, setIsImageLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        dispatch(GetPaymentContractsActionAsync(null, null, null, null, pageIndex, pageSize))
            .finally(() => setLoading(false));
    }, [dispatch, pageIndex, pageSize]);

    const handleTableChange = (pagination) => {
        setPageIndex(pagination.current);
        setPageSize(pagination.pageSize);
    };

    const handleImageClick = (imageURL) => {
        setSelectedImage(imageURL);
        setIsImageLoading(true);
        setIsModalVisible(true);
    };

    const handleImageLoad = () => {
        setIsImageLoading(false);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedImage(null);
    };

    const renderStatusBadge = (status) => {
        const statusMapping = {
            NotCompleted: {
                text: "Chưa hoàn thành",
                color: 'gray',
                backgroundColor: '#f0f0f0',
                borderColor: '#d9d9d9'
            },
            Completed: {
                text: "Hoàn thành",
                color: 'green',
                backgroundColor: '#f6ffed',
                borderColor: '#b7eb8f'
            },
            Fail: {
                text: "Thất bại",
                color: 'red',
                backgroundColor: '#fff2f0',
                borderColor: '#ffa39e'
            }
        };

        const config = statusMapping[status] || statusMapping.NotCompleted;

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
            title: "Tiêu đề",
            dataIndex: "title",
            key: "title",
            align: "center",
        },
        {
            title: "Mã hợp đồng",
            dataIndex: "contractCode",
            key: "contractCode",
            align: "center",
        },
        {
            title: "Tên đại lý",
            dataIndex: "agencyName",
            key: "agencyName",
            align: "center",
        },
        {
            title: "Số tiền",
            dataIndex: "amount",
            key: "amount",
            align: "center",
            render: (text) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(text),
        },
        {
            title: "Phương thức",
            dataIndex: "method",
            key: "method",
            align: "center",
            render: (text) => renderMethodBadge(text),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            align: "center",
            render: (text) => renderStatusBadge(text),
        },
        {
            title: "Ngày tạo",
            dataIndex: "creationDate",
            key: "creationDate",
            align: "center",
            render: (text) => moment(text).format("DD/MM/YYYY HH:mm"),
        },
        {
            title: "Hình ảnh",
            dataIndex: "imageURL",
            key: "imageURL",
            align: "center",
            render: (text) => text ? <Button type="link" onClick={() => handleImageClick(text)}>Xem ảnh</Button> : null,
        }
    ];

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title mb-3">Lịch sử thanh toán</h5>
                <Table
                    bordered
                    columns={columns}
                    dataSource={paymentInfo}
                    rowKey={(record) => record.id}
                    pagination={{
                        current: pageIndex,
                        pageSize,
                        total: totalPagesCount * pageSize,
                        showSizeChanger: true,
                        pageSizeOptions: ["10", "20", "50"],
                    }}
                    onChange={handleTableChange}
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
                        <img src={selectedImage} alt="Payment" style={{ width: '100%' }} onLoad={handleImageLoad} />
                    )}
                </Modal>
            </div>
        </div>
    );
};

export default PaymentManagement;
