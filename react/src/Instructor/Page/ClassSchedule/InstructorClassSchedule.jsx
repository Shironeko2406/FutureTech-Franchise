import { useEffect } from 'react'
import { Card, Select } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { fetchWeekData, setYear, setWeek } from '../../../Redux/ReducerAPI/ClassScheduleReducer'
import InstructorScheduleTable from '../../Component/InstructorScheduleTable'
import './InstructorClassSchedule.css'

export default function InstructorClassSchedule() {
    const dispatch = useDispatch()
    const { selectedYear, selectedWeek, years, weeks, loading, weekData } = useSelector((state) => state.ClassScheduleReducer)

    useEffect(() => {
        dispatch(fetchWeekData())
    }, [dispatch])

    if (loading || !weekData) {
        return <div>Loading...</div>
    }

    return (
        <div className="instructor-container">
            <Card>
                <div className="instructor-selectors mb-4">
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
                <InstructorScheduleTable />
            </Card>
        </div>
    )
}