import React, { useState } from "react";
import { Table, Button } from "antd";
import { useSelector } from "react-redux";
import CreateAssessmentModal from "../Modal/CreateAssessmentModal";

const ViewAssessment = () => {
  const { assessments } = useSelector((state) => state.CourseReducer);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const showDrawer = () => {
    setIsDrawerVisible(true);
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
  };

  const columns = [
    {
      title: "No",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "Trọng số",
      dataIndex: "weight",
      key: "weight",
    },
    {
      title: "Tiêu chí hoàn thành",
      dataIndex: "completionCriteria",
      key: "completionCriteria",
    },
    {
      title: "Thời gian",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Loại câu hỏi",
      dataIndex: "questionType",
      key: "questionType",
    },
  ];

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title">Chi tiết đánh giá</h5>
          {/* {assessments.length > 0 ? ( // Kiểm tra nếu có chapters
            <button className="btn btn-warning" onClick={showDrawer}>Sửa đánh giá</button>
          ) : (
            <button className="btn btn-primary" onClick={showDrawer}>Thêm đánh giá</button>
          )} */}
        </div>
        {/* Bảng hiển thị assessment */}
        <Table
          bordered
          pagination={false}
          dataSource={assessments}
          columns={columns}
          rowKey="id"
        />
      </div>
      <CreateAssessmentModal
        isDrawerVisible={isDrawerVisible}
        closeDrawer={closeDrawer}
      />
    </div>
  );
};

export default ViewAssessment;
