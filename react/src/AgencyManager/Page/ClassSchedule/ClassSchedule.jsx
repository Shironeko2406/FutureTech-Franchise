import React, { useState } from 'react'
import { Card, Button } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { fetchWeekData } from '../../../Redux/ReducerAPI/ClassScheduleReducer'
import ScheduleHeader from '../../Component/ScheduleHeader'
import ScheduleTable from '../../Component/ScheduleTable'
import AddClassModal from '../../Modal/AddClassModal'
import './ClassSchedule.css'

export default function ClassSchedule() {
  const dispatch = useDispatch()
  const { weekData, loading } = useSelector((state) => state.ClassScheduleReducer)
  const [modalVisible, setModalVisible] = useState(false);

  const handleOk = (values) => {
    console.log('Received values:', values);
    setModalVisible(false);
    // Process the submitted data here
  };
  React.useEffect(() => {
    dispatch(fetchWeekData())
  }, [dispatch])

  if (loading || !weekData) {
    return <div>Loading...</div>
  }

  return (
    <div className="agency-manager-container">
      <Card>
        <Button onClick={() => setModalVisible(true)}>Thêm lịch học</Button>
        <ScheduleHeader />
        <ScheduleTable />
        <AddClassModal
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={handleOk} />
      </Card>

    </div>
  )
}