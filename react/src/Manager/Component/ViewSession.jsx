import React, { useState } from "react";
import { Table, Button } from "antd";
import { useSelector } from "react-redux";
import CreateSessionModal from "../Modal/CreateSessionModal";

const ViewSession = () => {
  const { sessions } = useSelector((state) => state.CourseReducer);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const showDrawer = () => {
    setIsDrawerVisible(true);
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
  };
  // Tạo danh sách filters tự động dựa trên dữ liệu của chapter
  const uniqueChapters = [...new Set(sessions.map((item) => item.chapter))]; // Lấy các chương không trùng lặp
  const chapterFilters = uniqueChapters.map((chapter) => ({
    text: chapter,
    value: chapter,
  }));

  const columns = [
    {
      title: "No",
      dataIndex: "number",
      key: "number",
      width: "5%",
    },
    {
      title: "Chủ đề",
      dataIndex: "topic",
      key: "topic",
      width: "40%",
    },
    {
      title: "Chương",
      dataIndex: "chapter",
      key: "chapter",
      width: "20%",
      filters: chapterFilters,
      onFilter: (value, record) => record.chapter.includes(value),
    },
  ];

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title">Chi tiết các buổi học</h5>
          {/* {sessions.length > 0 ? ( // Kiểm tra nếu có chapters
            <button className="btn btn-warning" onClick={showDrawer}>Sửa buổi học</button>
          ) : (
            <button className="btn btn-primary" onClick={showDrawer}>Thêm buổi học</button>
          )} */}
        </div>
        {/* Bảng hiển thị session */}
        <Table
          bordered
          dataSource={sessions}
          columns={columns}
          rowKey="id"
          pagination={true}
        />
      </div>
      <CreateSessionModal
        isDrawerVisible={isDrawerVisible}
        closeDrawer={closeDrawer}
      />
    </div>
  );
};

export default ViewSession;
