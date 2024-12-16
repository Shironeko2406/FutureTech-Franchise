import React, { useEffect, useState } from 'react'
import { List, Card, Typography, Space, Tag, Button, Image, Popconfirm } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined, CalendarOutlined } from '@ant-design/icons'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { GetQuestionBankByChapterId } from '../../../Redux/ReducerAPI/ChapterReducer'
import { useLoading } from '../../../Utils/LoadingContext'
import { DeleteQuestionByIdActionAsync } from '../../../Redux/ReducerAPI/QuestionReducer'
import CreateQuestionModal from '../../Modal/CreateQuestionModal'
import EditQuestionModal from '../../Modal/EditQuestionModal'

const { Title, Text } = Typography

const ViewQuestionChapterManager = () => {
  const location = useLocation(); // Lấy query parameters từ URL
  const queryParams = new URLSearchParams(location.search);
  const chapterId = queryParams.get("chapterId"); // Lấy chapterId từ query parameters
  const { questionsOfChapter } = useSelector((state) => state.ChapterReducer);
  const dispatch = useDispatch()
  const { setLoading } = useLoading();
  const [isModalCreateVisible, setIsModalCreateVisible] = useState(false)
  const [isModalEditVisible, setIsModalEditVisible] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState({})

  useEffect(() => {
    setLoading(true);
    dispatch(GetQuestionBankByChapterId(chapterId)).finally(() => setLoading(false));
  }, [chapterId])

  const handleDeleteQuestion = async (questionId) => {
    setLoading(true);
    try {
      await dispatch(DeleteQuestionByIdActionAsync(questionId, chapterId));
    } finally {
      setLoading(false);
    }
  };

  const showModalCreate = () => {
    setIsModalCreateVisible(true);
  };

  const closeModalCreate = () => {
    setIsModalCreateVisible(false);
  };

  const showModalEdit = (question) => {
    setIsModalEditVisible(true);
    setSelectedQuestion(question)
  };

  const closeModalEdit = () => {
    setIsModalEditVisible(false);
    setSelectedQuestion({})
  };

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div className="flex justify-between items-center">
          <Title level={3}><CalendarOutlined /> Quản lý câu hỏi</Title>
          {/* <Button type="primary" icon={<PlusOutlined />} onClick={showModalCreate}>
            Thêm câu hỏi mới
          </Button> */}
        </div>
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={questionsOfChapter}
          renderItem={(question) => (
            <List.Item>
              <Card
                title={<Text strong>{question.description}</Text>}
              // extra={
              //   <Space>
              //     <Button icon={<EditOutlined />} onClick={() => showModalEdit(question)}>
              //       Cập nhật
              //     </Button>
              //     <Popconfirm
              //       title="Bạn có chắc chắn muốn xóa câu hỏi này?"
              //       onConfirm={() => handleDeleteQuestion(question.id)} // Khi xác nhận, gọi hàm xóa
              //       okText="Xóa"
              //       cancelText="Hủy"
              //     >
              //       <Button icon={<DeleteOutlined />} danger>
              //         Xóa
              //       </Button>
              //     </Popconfirm>
              //   </Space>
              // }
              >
                {question.imageURL && (
                  <Image
                    src={question.imageURL}
                    alt={`Image for ${question.description}`}
                    width={250}
                  />
                )}
                <List
                  dataSource={question.questionOptions}
                  renderItem={(option) => (
                    <List.Item>
                      <Space>
                        {option.status ? (
                          <Tag color="green">Đúng</Tag>
                        ) : (
                          <Tag color="red">Sai</Tag>
                        )}
                        <Text>{option.description}</Text>
                      </Space>
                    </List.Item>
                  )}
                />
              </Card>
            </List.Item>
          )}
        />
      </Space>

      {/*Modal*/}
      <CreateQuestionModal
        visible={isModalCreateVisible}
        onClose={closeModalCreate}
      />

      <EditQuestionModal
        visible={isModalEditVisible}
        onClose={closeModalEdit}
        question={selectedQuestion}
      />
    </Card>
  )
}

export default ViewQuestionChapterManager