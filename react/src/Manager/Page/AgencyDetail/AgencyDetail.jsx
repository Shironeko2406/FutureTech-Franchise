import React, { useState, useMemo, useEffect } from 'react';
import { Button, Card, Input, Select, List, Typography, Row, Col, Popconfirm } from 'antd';
import {
  CheckCircleFilled, MinusCircleFilled, PlusOutlined,
  DeleteOutlined, SearchOutlined, FlagOutlined, TeamOutlined, FileDoneOutlined,
  AppstoreAddOutlined, AreaChartOutlined, EditOutlined, CheckCircleOutlined,
  DollarOutlined, CloseCircleFilled, RightCircleOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GetTaskByAgencyIdActionAsync } from '../../../Redux/ReducerAPI/AgencyReducer';
import CreateTaskBySelectedTypeModal from '../../Modal/CreateTaskBySelectedTypeModal';
import ViewTaskDetailModal from '../../Modal/ViewTaskDetailModal';
import { DeleteTaskByIdActionAsync, GetTaskDetailByIdActionAsync } from '../../../Redux/ReducerAPI/WorkReducer';
import { GetManagerUserAddAppointmentActionAsync } from '../../../Redux/ReducerAPI/UserReducer';
import moment from 'moment';
import { useLoading } from '../../../Utils/LoadingContext';
import EditTaskModal from '../../Modal/EditTaskModal';

const { Title, Text } = Typography;
const { Option } = Select;

// Styled components
const StyledCard = styled(Card)`
  .ant-card-head-title {
    text-align: center;
  }
`;

const MilestoneButton = styled(Button)`
  height: 140px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  border-radius: 8px;
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }

  ${props => props.selected && `
    border-color: #1890ff;
    border-width: 2px;
    background-color: #e6f7ff;
  `}
`;

const ScrollableDiv = styled.div`
  height: 500px;
  overflow-y: auto;

  @media (max-width: 768px) {
    height: 300px;
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;

const StatusTag = styled.span`
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  color: white;
`;

const CompulsoryTask = styled(List.Item)`
  background-color: #fff1f0 !important;
`;

// Helper functions
const getTypeStatusColor = (status) => {
  switch (status) {
    case "Completed": return '#52c41a';
    case "In Progress": return '#faad14';
    case "Incomplete": return '#f5222d';
    case "Pending":
    default: return '#d9d9d9';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "Approved": return '#52c41a';
    case "Rejected": return '#f5222d';
    case "None":
    default: return '#d9d9d9';
  }
};

const getIconForTypeStatus = (status) => {
  const iconStyle = { fontSize: 30, color: getTypeStatusColor(status) };
  switch (status) {
    case "Interview": return <TeamOutlined style={iconStyle} />;
    case "AgreementSigned": return <FileDoneOutlined style={iconStyle} />;
    case "BusinessRegistered": return <AppstoreAddOutlined style={iconStyle} />;
    case "SiteSurvey": return <AreaChartOutlined style={iconStyle} />;
    case "Design": return <EditOutlined style={iconStyle} />;
    case "Quotation": return <DollarOutlined style={iconStyle} />;
    case "SignedContract": return <CheckCircleOutlined style={iconStyle} />;
    default: return null;
  }
};

const getStatusIcon = (status) => {
  const iconStyle = { fontSize: 24, color: getStatusColor(status) };
  switch (status) {
    case "Approved": return <CheckCircleFilled style={iconStyle} />;
    case "Rejected": return <CloseCircleFilled style={iconStyle} />;
    case "None":
    default: return <MinusCircleFilled style={iconStyle} />;
  }
};

const getTypeStatus = (type, tasks) => {
  const typeTasks = tasks.filter(task => task.type === type);

  // If there are no tasks, return "Pending"
  if (typeTasks.length === 0) {
    return "Pending";
  }
  const compulsoryTasks = typeTasks.filter(task => task.level === "Compulsory");
  const optionalTasks = typeTasks.filter(task => task.level === "Optional");
  
  const allCompulsoryApproved = compulsoryTasks.every(task => task.status === "Approved");
  const allTasksApprovedOrOptionalRejected = typeTasks.every(task => 
    task.status === "Approved" || (task.level === "Optional" && task.status === "Rejected")
  );
  
  if (allCompulsoryApproved && allTasksApprovedOrOptionalRejected) {
    return "Completed";
  }
  if (compulsoryTasks.some(task => task.status === "Rejected")) {
    return "Incomplete";
  }
  if (typeTasks.some(task => task.status === "Approved" || task.status === "Rejected")) {
    return "In Progress";
  }
  return "Pending";
};


// New translation functions
const translateStatus = (status) => {
  const translations = {
    "Approved": "Đã duyệt",
    "Rejected": "Từ chối",
    "None": "Chưa xử lý",
    "Completed": "Hoàn thành",
    "In Progress": "Đang thực hiện",
    "Pending": "Chờ xử lý",
    "Incomplete": "Không hoàn thành"
  };
  return translations[status] || status;
};

const translateType = (type) => {
  const translations = {
    "Interview": "Phỏng vấn",
    "AgreementSigned": "Ký thỏa thuận 2 bên",
    "BusinessRegistered": "Đăng ký doanh nghiệp",
    "SiteSurvey": "Khảo sát mặt bằng",
    "Design": "Thiết kế",
    "Quotation": "Báo giá cho khách hàng",
    "SignedContract": "Ký hợp đồng thành công"
  };
  return translations[type] || type;
};


// const tasks = [ // data task tôi call api
//   {
//     id: "3a68a519-19fe-4b95-c509-08dd097f5ef0",
//     title: "Task 1",
//     startDate: "2024-11-20T16:24:38.045",
//     endDate: "2024-11-21T16:24:38.045",
//     type: "AgreementSigned",
//     status: "None",
//     level: "Optional",
//     submit: "None",
//   },
//   {
//     id: "3a68a519-19fe-4b95-c509-08dd097f5ef6",
//     title: "Task 1",
//     startDate: "2024-11-20T16:24:38.045",
//     endDate: "2024-11-21T16:24:38.045",
//     type: "AgreementSigned",
//     status: "None",
//     level: "Optional",
//     submit: "None",
//   },
//   {
//     id: "0ccfaaed-713e-4a76-c506-08dd097f5ef0",
//     title: "Task 1",
//     startDate: "2024-11-20T00:00:00",
//     endDate: "2024-11-22T00:00:00",
//     type: "Interview",
//     status: "Rejected",
//     level: "Compulsory",
//     submit: "None",
//   },
//   {
//     id: "602cbb55-8732-4794-c50a-08dd097f5ef0",
//     title: "Task 1",
//     startDate: "2024-11-20T16:24:38.045",
//     endDate: "2024-11-21T16:24:38.045",
//     type: "Interview",
//     status: "Approved",
//     level: "Compulsory",
//     submit: "None",
//   },
//   {
//     id: "0ee259f8-9a32-421a-c50b-08dd097f5ef0",
//     title: "Task 3",
//     startDate: "2024-11-21T00:00:00",
//     endDate: "2024-11-21T01:01:00",
//     type: "Interview",
//     status: "Approved",
//     level: "Compulsory",
//     submit: "None",
//   },
// ];

// Updated component
export default function AgencyDetail() {
  const { tasks, agencyStatus } = useSelector((state) => state.AgencyReducer);
  const dispatch = useDispatch()
  const {id} = useParams()
  const { setLoading } = useLoading();
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalCreateTaskVisible, setModalCreateTaskVisible] = useState(false);
  const [modalShowTaskDetailVisible, setModalShowTaskDetailVisible] = useState(false);
  const [modalEditTaskByIdVisible, setModalEditTaskByIdVisible] = useState(false);

  useEffect(() => {
    dispatch(GetTaskByAgencyIdActionAsync(id))
    dispatch(GetManagerUserAddAppointmentActionAsync())
  }, [id, dispatch])

  const taskDataModify = useMemo(() => {
    const allTypes = [
      'Interview',
      'AgreementSigned',
      'BusinessRegistered',
      'SiteSurvey',
      'Design',
      'Quotation',
      'SignedContract'
    ];

    const initialStructure = allTypes.map(type => ({ type, tasks: [] }));

    return tasks.reduce((acc, task) => {
      const typeGroup = acc.find(group => group.type === task.type);
      if (typeGroup) {
        typeGroup.tasks.push(task);
      }
      return acc;
    }, initialStructure);
  }, [tasks]);
  console.log(taskDataModify)

  const selectedTasks = useMemo(() => {
    if (!selectedType) return [];
    const selectedGroup = taskDataModify.find(group => group.type === selectedType);
    return selectedGroup ? selectedGroup.tasks : [];
  }, [selectedType, taskDataModify]);

  const filteredData = useMemo(() => {
    return taskDataModify.filter(group => {
      const isTypeMatch = typeFilter === "all" || group.type === typeFilter;
      const isSearchMatch = translateType(group.type).toLowerCase().includes(searchTerm.toLowerCase());
      return isTypeMatch && isSearchMatch;
    });
  }, [taskDataModify, typeFilter, searchTerm]);

  const renderMilestoneButton = (group, index) => {
    const status = getTypeStatus(group.type, group.tasks);
    const statusColor = getTypeStatusColor(status);
    const icon = getIconForTypeStatus(group.type);

    return (
      <MilestoneButton
        key={index}
        onClick={() => setSelectedType(group.type)}
        selected={selectedType === group.type}
      >
        {React.cloneElement(icon, { style: { fontSize: 30, color: statusColor } })}
        <Text strong style={{ textAlign: 'center', wordBreak: 'break-word' }}>{translateType(group.type)}</Text>
        <Text type="secondary">{group.tasks.length} {group.tasks.length === 1 ? 'công việc' : 'công việc'}</Text>
        <StatusTag style={{ backgroundColor: statusColor }}>{translateStatus(status).toUpperCase()}</StatusTag>
      </MilestoneButton>
    );
  };

  //Các hàm action
  const handleDeleteTaskById = (taskId) => {
    setLoading(true)
    dispatch(DeleteTaskByIdActionAsync(taskId, id)).finally(()=>setLoading(false))
  }
  //--------------------------

  // Các hàm đóng mở state modal
  const showModalCreateTask = () => setModalCreateTaskVisible(true);
  const handleCloseModalCreateTask = () => setModalCreateTaskVisible(false);

  const openModalShowTaskDetail = (id) => {
    setModalShowTaskDetailVisible(true)
    dispatch(GetTaskDetailByIdActionAsync(id))
  };

  const handleCloseModalShowTaskDetail = () => {
    setModalShowTaskDetailVisible(false)
  };

  const openModalEditTask = (task) => {
    setModalEditTaskByIdVisible(true)
    setSelectedTask(task)
  };
  const handleCloseModalEditTask = () => {
    setModalEditTaskByIdVisible(false)
    setSelectedTask(null)
  };
  //-------------------------

  return (
    <StyledCard title={<Title level={4}><FlagOutlined /> Tiến trình nhượng quyền</Title>}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <div style={{ marginBottom: '16px' }}>
            <Input
              placeholder="Tìm kiếm giai đoạn..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginBottom: '8px' }}
            />
            <Select
              style={{ width: "100%" }}
              value={typeFilter}
              onChange={(value) => setTypeFilter(value)}
            >
              <Option key="all" value="all">Tất cả</Option>
              {taskDataModify.map((group) => (
                <Option key={group.type} value={group.type}>{translateType(group.type)}</Option>
              ))}
            </Select>
          </div>
          <ScrollableDiv>
            {filteredData.map((group, index) => renderMilestoneButton(group, index))}
          </ScrollableDiv>
        </Col>
        
        <Col xs={24} md={16}>
          {selectedType ? (
            <StyledCard
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span>{translateType(selectedType)}</span>
                  {['Processing', 'Approved'].includes(agencyStatus) && (
                    <Button type="primary" icon={<PlusOutlined />} onClick={showModalCreateTask}>
                      Thêm công việc
                    </Button>
                  )}
                </div>
              }
            >
              <ScrollableDiv>
              <List
                  dataSource={selectedTasks}
                  renderItem={task => {
                    const isEditableAndDeletable = task?.status === "None" && ['Processing', 'Approved'].includes(agencyStatus); //Bắt ẩn hiện nút edit và del
                    const TaskItem = task.level === "Compulsory" ? CompulsoryTask : List.Item;
                    return (
                      <TaskItem
                        style={{
                          backgroundColor: task.level === "Compulsory" ? "#fff1f0" : "#f0f5ff",
                          marginBottom: "8px",
                          borderRadius: "8px",
                          padding: "12px"
                        }}
                        key={task.id}
                        actions={[
                          <Button type="text" style={{ color: '#1890ff' }} icon={<RightCircleOutlined/>} onClick={() => {openModalShowTaskDetail(task.id)}} />,
                          isEditableAndDeletable && (
                            <Button type="text" icon={<EditOutlined />} onClick={() => {openModalEditTask(task)}} />
                          ),
                          isEditableAndDeletable && (
                            <Popconfirm
                              title="Bạn muốn xóa công việc này?"
                              onConfirm={() => handleDeleteTaskById(task.id)} 
                            >
                              <Button type="text" danger icon={<DeleteOutlined />}/>
                            </Popconfirm>
                          ),
                        ].filter(Boolean)}
                      >
                        <List.Item.Meta
                          avatar={getStatusIcon(task.status)}
                          title={
                            <span>
                              {task.title}
                              {task.level === "Compulsory" && (
                                <>
                                  <FlagOutlined style={{ color: '#ff4d4f', marginLeft: '8px' }} />
                                  <Text type="danger" strong style={{ marginLeft: '4px' }}>
                                    (Bắt buộc)
                                  </Text>
                                </>
                              )}
                            </span>
                          }
                          description={
                            <div>
                              <StatusTag style={{ backgroundColor: getStatusColor(task.status), marginBottom: '4px' }}>
                                {translateStatus(task.status).toUpperCase()}
                              </StatusTag>
                              <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                                <CalendarOutlined style={{ marginRight: '4px' }} />
                                <Text type="secondary">
                                  {moment(task.startDate).format('DD/MM/YYYY HH:mm')} - {moment(task.endDate).format('DD/MM/YYYY HH:mm')}
                                </Text>
                              </div>
                            </div>
                          }
                        />
                      </TaskItem>
                    );
                  }}
                />
              </ScrollableDiv>
            </StyledCard>
          ) : (
            <StyledCard>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '48px' }}>
                <Text type="secondary">Chọn một giai đoạn để xem và quản lý công việc</Text>
              </div>
            </StyledCard>
          )}
        </Col>
      </Row>

      {/*Các Modal*/}
      <CreateTaskBySelectedTypeModal
        visible={modalCreateTaskVisible}
        onClose={handleCloseModalCreateTask}
        selectedType={selectedType}
      />

      <ViewTaskDetailModal
        visible={modalShowTaskDetailVisible}
        onClose={handleCloseModalShowTaskDetail}
        setVisible={setModalShowTaskDetailVisible}
      />

      <EditTaskModal
        visible={modalEditTaskByIdVisible}
        onClose={handleCloseModalEditTask}
        task={selectedTask}
      />

    </StyledCard>
  );
}