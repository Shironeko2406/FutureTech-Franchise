import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Descriptions } from "antd";
import CreateSyllabus from "../Modal/CreateSyllabus";
import EditSyllabusModal from "../Modal/EditSyllabusModal";
import SendFileCourseDetailModal from "../Modal/SendFileCourseDetailModal";

const labelStyle = { textAlign: "right", width: "220px" };

const ViewSyllabus = () => {
  const { courseById } = useSelector((state) => state.CourseReducer);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isDrawerEditSyllabusVisible, setIsDrawerEditSyllabusVisible] = useState(false);
  const [syllabusSelected, setSyllabusSelected] = useState(null);

  const showDrawer = () => {
    setIsDrawerVisible(true);
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
  };

  const showModalEditSyllabus = (syllabus) => {
    setSyllabusSelected(syllabus);
    setIsDrawerEditSyllabusVisible(true);
  };

  const closeModalEditSyllabus = () => {
    setIsDrawerEditSyllabusVisible(false);
    setSyllabusSelected(null);
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title">Chi tiết giáo trình</h5>
          {/* {courseById?.syllabus ? (
            <button
              className="btn btn-warning"
              onClick={() => showModalEditSyllabus(courseById.syllabus)}
            >
              Sửa giáo trình
            </button>
          ) : (
            <button className="btn btn-primary" onClick={showDrawer}>
              Thêm giáo trình
            </button>
          )} */}
        </div>
        <div style={{ overflowX: "auto" }}>
          <Descriptions bordered column={1} style={{ minWidth: "600px" }}>
            <Descriptions.Item label="Tên khóa học:" labelStyle={labelStyle}>
              {courseById?.name ?? "null"}
            </Descriptions.Item>
            <Descriptions.Item label="Mã khóa học:" labelStyle={labelStyle}>
              {courseById?.code ?? "null"}
            </Descriptions.Item>
            <Descriptions.Item
              label="Phân bổ thời gian:"
              labelStyle={labelStyle}
            >
              {courseById?.syllabus?.timeAllocation ?? "Chưa có giáo trình"}
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả:" labelStyle={labelStyle}>
              {courseById?.syllabus?.description ?? "Chưa có giáo trình"}
            </Descriptions.Item>
            <Descriptions.Item
              label="Nhiệm vụ của sinh viên:"
              labelStyle={labelStyle}
            >
              {courseById?.syllabus?.studentTask ?? "Chưa có giáo trình"}
            </Descriptions.Item>
            <Descriptions.Item label="Công cụ yêu cầu:" labelStyle={labelStyle}>
              {courseById?.syllabus?.toolsRequire
                ?.split("\n")
                .map((line, index) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                )) ?? "Chưa có giáo trình"}
            </Descriptions.Item>
            <Descriptions.Item label="Thang điểm:" labelStyle={labelStyle}>
              {courseById?.syllabus?.scale ?? "Chưa có giáo trình"}
            </Descriptions.Item>
            <Descriptions.Item label="Điểm trung bình:" labelStyle={labelStyle}>
              {courseById?.syllabus?.minAvgMarkToPass ?? "Chưa có giáo trình"}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
      <CreateSyllabus
        isDrawerVisible={isDrawerVisible}
        closeDrawer={closeDrawer}
      />
      <EditSyllabusModal
        visible={isDrawerEditSyllabusVisible}
        onClose={closeModalEditSyllabus}
        syllabus={syllabusSelected}
      />
    </div>
  );
};

export default ViewSyllabus;
