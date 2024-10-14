import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Popconfirm, Space, Table } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { DeleteSlotActionAsync, GetSlotActionAsync } from "../../../Redux/ReducerAPI/SlotReducer";

const SlotManager = () => {
  const {slotData} = useSelector((state)=> state.SlotReducer)
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  useEffect(()=>{
    dispatch(GetSlotActionAsync())
  },[])

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const handleUpdate = (id) => {
    console.log("Cập nhật slot:", id);
  };

  const handleDelete = (id) => {
    dispatch(DeleteSlotActionAsync(id))
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button type="link" size="small" onClick={() => close()}>
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const columns = [
    {
      title: "No",
      dataIndex: "key",
      key: "no",
      width: "10%",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Slot học",
      dataIndex: "name",
      key: "name",
      width: "20%",
      ...getColumnSearchProps("name"), // Chỉ tìm kiếm theo tên
    },
    {
      title: "Giờ bắt đầu",
      dataIndex: "startTime",
      key: "startTime",
      width: "20%",
      render: (time) => dayjs(time, "HH:mm:ss").format("HH:mm A"),
    },
    {
      title: "Giờ kết thúc",
      dataIndex: "endTime",
      key: "endTime",
      width: "20%",
      render: (time) => dayjs(time, "HH:mm:ss").format("HH:mm A"),
    },
    {
      title: "Action",
      key: "action",
      width: "20%",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleUpdate(record.id)}
          />
          <Popconfirm
            title="Xác nhận xóa slot này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button type="link" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title pb-3">Danh Sách Slot Học</h5>
        <div className="table-responsive">
          <Table
            bordered
            columns={columns}
            dataSource={slotData}
            rowKey="id"
          />
        </div>
      </div>
    </div>
  );
};

export default SlotManager;
