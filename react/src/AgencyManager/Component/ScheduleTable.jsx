import React from 'react'
import { Tooltip } from 'antd'
import { useSelector } from 'react-redux'
import { format, addDays, parseISO } from 'date-fns'

const slots = Array.from({ length: 8 }, (_, i) => `Slot ${i + 1}`)
const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

export default function ScheduleTable() {
    const { weekData, filteredCourses } = useSelector((state) => state.ClassScheduleReducer)

    if (!weekData || !weekData.week || !weekData.week.startDate) {
        return <div>No schedule data available</div>
    }

    const weekDates = Array.from({ length: 7 }, (_, i) => {
        const startDate = parseISO(weekData.week.startDate)
        return addDays(startDate, i)
    })

    return (
        <div className="agency-manager-table-container">
            <table className="agency-manager-schedule-table">
                <thead>
                    <tr>
                        <th></th>
                        {weekDates.map((date, index) => (
                            <th key={index}>
                                <div className="agency-manager-day-header">
                                    {daysOfWeek[index]}
                                    <br />
                                    {format(date, 'dd/MM')}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {slots.map((slot) => (
                        <tr key={slot}>
                            <td className="agency-manager-slot-cell">{slot}</td>
                            {weekDates.map((_, dayIndex) => {
                                const slotCourses = filteredCourses.filter(c => c.slot === parseInt(slot.split(' ')[1]) && c.day === dayIndex)
                                return (
                                    <td key={dayIndex} className="agency-manager-course-cell">
                                        {slotCourses.map((course) => (
                                            <Tooltip
                                                key={course.id}
                                                title={
                                                    <div>
                                                        <p><strong>{course.name}</strong></p>
                                                        <p>Mã môn: {course.code}</p>
                                                        <p>Giảng viên: {course.instructor}</p>
                                                        <p>Phòng: {course.location}</p>
                                                    </div>
                                                }
                                            >
                                                <div className="agency-manager-course-item">
                                                    {course.code} - {course.location}
                                                </div>
                                            </Tooltip>
                                        ))}
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}