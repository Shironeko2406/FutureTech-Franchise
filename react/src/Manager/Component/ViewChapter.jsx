import { Button, Dropdown, Popconfirm, Space } from "antd";
import React, { useState } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import CreateChapterModal from "../Modal/CreateChapterModal";
import { Link, useNavigate } from "react-router-dom";
import {
  EditOutlined,
  DeleteOutlined,
  FileAddOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { DeleteChapterActionAsync } from "../../Redux/ReducerAPI/ChapterReducer";
import EditChapterModal from "../Modal/EditChapterModal";
import { useLoading } from "../../Utils/LoadingContext";
import CreateMaterialModal from "../Modal/CreateMaterialModal";

const ViewChapter = () => {
  const { chapters } = useSelector((state) => state.CourseReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedChapterForCreateMaterial, setSelectedChapterForCreateMaterial] = useState(null);
  const [isModalEditChapterVisible, setIsModalEditChapterVisible] = useState(false);
  const [isModalCreateMaterialVisible, setsModalCreateMaterialVisible] = useState(false);
  const { setLoading } = useLoading();

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
    {
      label: "Thêm tài liệu",
      key: "addMaterial",
      icon: <FileAddOutlined style={{ color: "#1890ff" }} />,
    },
  ];

  const handleMenuClick = (record, key) => {
    if (key === "edit") {
      showModalEditChapter(record);
    } else if (key === "delete") {
      // Xác nhận xóa
      handleDelete(record.id);
    } else if (key === "addMaterial") {
      showModalCreateMaterialChapter(record);
    }
  };

  const handleDelete = async (chapterId) => {
    setLoading(true);
    try {
      await dispatch(DeleteChapterActionAsync(chapterId, id));
    } finally {
      setLoading(false);
    }
  };

  const showModalEditChapter = (chapter) => {
    setSelectedChapter(chapter);
    setIsModalEditChapterVisible(true);
  };

  const closeModalEditChapter = () => {
    setIsModalEditChapterVisible(false);
    setSelectedChapter(null);
  };

  const showDrawer = () => {
    setIsDrawerVisible(true);
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
  };

  const showModalCreateMaterialChapter = (chapter) => {
    setSelectedChapterForCreateMaterial(chapter);
    setsModalCreateMaterialVisible(true);
  };

  const closeModalCreateMaterialChapter = () => {
    setsModalCreateMaterialVisible(false);
    setSelectedChapterForCreateMaterial(null);
  };

  const columns = [
    {
      title: "Số chương",
      dataIndex: "number",
      key: "number",
      width: "10%",
      align: "center",
    },
    {
      title: "Chủ đề",
      dataIndex: "topic",
      key: "topic",
      width: "20%",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: "50%",
    },
    {
      title: "Hành động",
      key: "action",
      width: "10%",
      render: (_, record) => (
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
      ),
    },
    {
      title: "Xem câu hỏi",
      key: "viewQuestions",
      width: "10%",
      align: "center",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => navigate(`/manager/course-detail/${id}/questions?chapterId=${record.id}`)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  const expandColumns = [
    {
      title: "No",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Tài liệu",
      dataIndex: "url",
      key: "url",
      render: (_, record, index) => (
        <Link to={record.url} target="_blank" rel="noopener noreferrer">
          Tài liệu {index + 1}
        </Link>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
  ];

  // Render nội dung mở rộng (expandedRowRender)
  const expandedRowRender = (record) => (
    <Table
      bordered
      columns={expandColumns}
      dataSource={record.chapterMaterials}
      pagination={false}
      rowKey="id"
      title={() => <h5>Tài nguyên</h5>}
    />
  );

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title">Chi tiết các chương</h5>
          {/* <button className="btn btn-primary" onClick={showDrawer}>
            Thêm chương
          </button> */}
        </div>
        {/* Bảng hiển thị chapter */}
        <Table
          bordered
          columns={columns}
          expandable={{
            expandedRowRender,
            rowExpandable: (record) => record.chapterMaterials.length > 0,
          }}
          dataSource={chapters}
          rowKey="id"
          scroll={{ x: 768 }}
        />
      </div>

      <CreateChapterModal
        isDrawerVisible={isDrawerVisible}
        closeDrawer={closeDrawer}
      />

      <EditChapterModal
        visible={isModalEditChapterVisible}
        onClose={closeModalEditChapter}
        chapter={selectedChapter}
      />

      <CreateMaterialModal
        visible={isModalCreateMaterialVisible}
        onClose={closeModalCreateMaterialChapter}
        chapter={selectedChapterForCreateMaterial}
      />
    </div>
  );
};

export default ViewChapter;
