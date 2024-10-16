import { Table } from 'antd'
import { useSelector } from 'react-redux'
import { format } from 'date-fns'

const timeSlots = [
    { slot: 'Slot 1', time: '07:00-08:30' },
    { slot: 'Slot 2', time: '08:45-10:15' },
    { slot: 'Slot 3', time: '10:30-12:00' },
    { slot: 'Slot 4', time: '12:30-14:00' },
    { slot: 'Slot 5', time: '14:15-15:45' },
    { slot: 'Slot 6', time: '16:00-17:30' },
    { slot: 'Slot 7', time: '17:45-19:15' },
    { slot: 'Slot 8', time: '19:30-21:00' }
]

export default function StudentScheduleTable() {
    const { weekData, filteredCourses } = useSelector((state) => state.ClassScheduleReducer)

    if (!weekData || !weekData.week || !weekData.week.startDate) {
        return <div>No schedule data available</div>
    }

    const weekDates = Array.from({ length: 7 }, (_, i) => {
        const startDate = new Date(weekData.week.startDate)
        return new Date(startDate.setDate(startDate.getDate() + i))
    })

    const columns = [
        {
            title: 'Slot',
            dataIndex: 'slot',
            key: 'slot',
            width: 80,
            render: (text) => <div className="student-slot-cell">{text}</div>,
        },
        ...weekDates.map((date, index) => ({
            title: (
                <div className="student-day-header">
                    <div>{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]}</div>
                    <div>{format(date, 'dd/MM')}</div>
                </div>
            ),
            dataIndex: `day${index}`,
            key: `day${index}`,
            render: (text) => {
                if (!text) return null
                return (
                    <div className="student-class-cell">
                        <div className="student-class-name">{text.name}</div>
                        <div className="student-class-info">at {text.location}</div>
                        <div className="student-class-info">{text.instructor}</div>
                        <div className="student-class-time">{text.time}</div>
                    </div>
                )
            },
        })),
    ]

    const data = timeSlots.map((timeSlot, slotIndex) => {
        const row = { key: slotIndex, slot: timeSlot.slot }
        weekDates.forEach((_, dayIndex) => {
            const course = filteredCourses.find(c => c.slot === slotIndex + 1 && c.day === dayIndex)
            if (course) {
                row[`day${dayIndex}`] = {
                    name: course.name,
                    location: course.location,
                    instructor: course.instructor,
                    time: timeSlot.time,
                }
            }
        })
        return row
    })

    return <Table className="student-schedule-table" columns={columns} dataSource={data} pagination={false} bordered />
}