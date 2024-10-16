import React from 'react'
import { Select, Button } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { setYear, setWeek, setCourse, setInstructor, showModal } from '../../Redux/ReducerAPI/ClassScheduleReducer'

export default function ScheduleHeader() {
    const dispatch = useDispatch()
    const { selectedYear, selectedWeek, selectedCourse, selectedInstructor, years, weeks, courseOptions, instructorOptions } = useSelector((state) => state.ClassScheduleReducer)

    return (
        <div className="selectors">
            <Select
                value={selectedYear}
                onChange={(value) => dispatch(setYear(value))}
                options={years.map(year => ({ value: year, label: year }))}
                style={{ width: 100 }}
            />
            <Select
                value={selectedWeek}
                onChange={(value) => dispatch(setWeek(value))}
                options={weeks}
                style={{ width: 200 }}
            />
            <Select
                value={selectedCourse}
                onChange={(value) => dispatch(setCourse(value))}
                options={[{ value: '', label: 'All Courses' }, ...courseOptions]}
                style={{ width: 200 }}
            />
            <Select
                value={selectedInstructor}
                onChange={(value) => dispatch(setInstructor(value))}
                options={[{ value: '', label: 'All Instructors' }, ...instructorOptions]}
                style={{ width: 200 }}
            />
            <Button type="primary" onClick={() => dispatch(showModal())}>
                Thêm lịch học
            </Button>
        </div>
    )
}