import React from 'react'
import { Card } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { fetchWeekData } from '../../../Redux/ReducerAPI/ClassScheduleReducer'
import ScheduleHeader from '../../Component/ScheduleHeader'
import ScheduleTable from '../../Component/ScheduleTable'
import AddClassModal from '../../Modal/AddClassModal'
import './ClassSchedule.css'

export default function ClassSchedule() {
  const dispatch = useDispatch()
  const { weekData, loading } = useSelector((state) => state.ClassScheduleReducer)

  React.useEffect(() => {
    dispatch(fetchWeekData())
  }, [dispatch])

  if (loading || !weekData) {
    return <div>Loading...</div>
  }

  return (
    <div className="agency-manager-container">
      <Card>
        <ScheduleHeader />
        <ScheduleTable />
        <AddClassModal />
      </Card>
    </div>
  )
}