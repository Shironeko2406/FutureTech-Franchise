
import { Table, Button, Typography, Spin, Input, DatePicker, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetContractsActionAsync } from "../../../Redux/ReducerAPI/ContractReducer";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const { Text } = Typography;

const ManageContractPage = () => {
    const { contracts, totalPagesCount } = useSelector((state) => state.ContractReducer);
    const dispatch = useDispatch();
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState(""); // Add search input state
    const [dateRange, setDateRange] = useState([null, null]); // Add date range state
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        const [startDate, endDate] = dateRange || [null, null];
        dispatch(GetContractsActionAsync(pageIndex, pageSize, startDate, endDate, searchInput)).finally(() => setLoading(false));
    }, [dispatch, pageIndex, pageSize, searchInput, dateRange]); // Add dateRange dependency

    const handleTableChange = (pagination) => {
        setPageIndex(pagination.current);
        setPageSize(pagination.pageSize);
    };

    const handleRowClick = (id) => {
        navigate(`${id}`);
    };

    const handleSearch = (value) => {
        setSearchInput(value);
        setPageIndex(1); // Reset to first page on search
    };

    const handleDateChange = (dates) => {
        setDateRange(dates);
        setPageIndex(1); // Reset to first page on date change
    };

    const columns = [
        {
            title: "Tiêu đề",
            dataIndex: "title",
            key: "title",
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
                </Button>
            ),
        },
        {
            title: "Tên trung tâm",
            dataIndex: "agencyName",
            key: "agencyName",
            align: "center",
        },
        {
            title: "Thời gian bắt đầu",
            dataIndex: "startTime",
            key: "startTime",
            align: "center",
            render: (text) => moment(text).format("DD/MM/YYYY"),
        },
        {
            title: "Thời gian kết thúc",
            dataIndex: "endTime",
            key: "endTime",
            align: "center",
            render: (text) => moment(text).format("DD/MM/YYYY"),
        },
        {
            title: "Tổng giá trị hợp đồng",
            dataIndex: "total",
            key: "total",
            align: "center",
            render: (text) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(text),
        },
    ];

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title mb-3">Danh Sách Hợp Đồng</h5>
                <Space style={{ marginBottom: 16 }}>
                    <Input.Search
                        placeholder="Tìm kiếm theo tiêu đề hoặc tên trung tâm"
                        onSearch={handleSearch}
                        enterButton
                        style={{ width: 300 }}
                    />
                    <DatePicker.RangePicker
                        onChange={handleDateChange}
                        style={{ marginLeft: 16 }}
                    />
                </Space>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <Spin size="large" />
                    </div>
                ) : (
                    <Table
                        bordered
                        columns={columns}
                        dataSource={contracts}
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
                )}
            </div>
        </div>
    );
};

export default ManageContractPage;