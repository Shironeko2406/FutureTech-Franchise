import React from "react";
import { Table, Button } from "antd";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const ViewMaterialCourse = () => {
  const { courseMaterials } = useSelector((state) => state.CourseReducer);

  const columns = [
    {
      title: "No",
      key: "index",
      render: (_, __, index) => index + 1, // Hiển thị số thứ tự (index + 1)
    },
    {
      title: "Tài nguyên",
      dataIndex: "url",
      key: "url",
      render: (_, record, index) => (
        <Link to={record.url} target="_blank" rel="noopener noreferrer">
          Tài nguyên {index + 1}
        </Link>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
  ];
  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title">Chi tiết tài nguyên khóa học</h5>
          {/* <Button type="primary">Thêm tài nguyên</Button> */}
        </div>
        {/* Bảng hiển thị material */}
        <Table
          bordered
          pagination={false}
          dataSource={courseMaterials}
          columns={columns}
          rowKey="id"
        />
      </div>
    </div>
  );
};

export default ViewMaterialCourse;
