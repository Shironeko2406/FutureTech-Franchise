import { useEffect } from 'react'
import { Card, Select } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { fetchWeekData, setYear, setWeek } from '../../../Redux/ReducerAPI/ClassScheduleReducer'
import StudentScheduleTable from '../../Component/StudentScheduleTable'
import './StudentClassSchedule.css'

export default function StudentSchedulePage() {
    const dispatch = useDispatch()
    const { selectedYear, selectedWeek, years, weeks, loading, weekData } = useSelector((state) => state.ClassScheduleReducer)

    useEffect(() => {
        dispatch(fetchWeekData())
    }, [dispatch])

    if (loading || !weekData) {
        return <div>Loading...</div>
    }

    return (
        <div className="student-container">
            <Card>
                <div className="student-selectors mb-4">
                    <Select
                        value={selectedYear}
                        onChange={(value) => dispatch(setYear(value))}
                        options={years.map(year => ({ value: year, label: year }))}
                        style={{ width: 100, marginRight: 16 }}
                    />
                    <Select
                        value={selectedWeek}
                        onChange={(value) => dispatch(setWeek(value))}
                        options={weeks}
                        style={{ width: 200 }}
                    />
                </div>
                <StudentScheduleTable />
            </Card>
        </div>
    )
}