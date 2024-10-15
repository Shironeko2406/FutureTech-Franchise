import { useState, useMemo, useEffect } from 'react'
import { Card, Button, Modal, Form, Select, Row, Col, Tooltip } from 'antd'
import { addDays, format, parse, startOfYear, addWeeks, endOfYear, differenceInWeeks, getMonth } from 'date-fns'
import './ClassSchedule.css'


const slots = Array.from({ length: 8 }, (_, i) => `Slot ${i + 1}`)
const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

const mockCourses = [
  { id: "1", code: "CSE101", name: "Introduction to Computer Science", location: "Room A101", instructor: "Dr. Smith", slot: 1, day: 0 },
  { id: "2", code: "MAT201", name: "Linear Algebra", location: "Room B202", instructor: "Prof. Johnson", slot: 2, day: 1 },
  { id: "3", code: "PHY301", name: "Quantum Mechanics", location: "Lab C303", instructor: "Dr. Brown", slot: 3, day: 2 },
  { id: "4", code: "ENG401", name: "Advanced Writing", location: "Room D404", instructor: "Ms. Davis", slot: 4, day: 3 },
  { id: "5", code: "BIO501", name: "Molecular Biology", location: "Lab E505", instructor: "Prof. Wilson", slot: 5, day: 4 },
  { id: "5", code: "BIO501", name: "Molecular Biology", location: "Lab E505", instructor: "Prof. Wilson", slot: 5, day: 4 },
  { id: "5", code: "BIO501", name: "Molecular Biology", location: "Lab E505", instructor: "Prof. Wilson", slot: 5, day: 4 },
];

const ClassSchedule = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())
  const [selectedWeek, setSelectedWeek] = useState('1')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedInstructor, setSelectedInstructor] = useState('')
  const [weekData, setWeekData] = useState(null)

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear()
    return [currentYear - 1, currentYear, currentYear + 1].map(year => year.toString())
  }, [])

  const weeks = useMemo(() => {
    const year = parseInt(selectedYear)
    const firstDayOfYear = startOfYear(new Date(year, 0, 1))
    const lastDayOfYear = endOfYear(new Date(year, 0, 1))
    const totalWeeks = differenceInWeeks(lastDayOfYear, firstDayOfYear) + 1

    return Array.from({ length: totalWeeks }, (_, i) => {
      const weekStart = addWeeks(firstDayOfYear, i)
      const weekEnd = addDays(weekStart, 6)
      return {
        value: (i + 1).toString(),
        label: `${format(weekStart, 'dd/MM')} to ${format(weekEnd, 'dd/MM')}`,
      }
    })
  }, [selectedYear])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [availableClasses, setAvailableClasses] = useState([]) // API fetch
  const [newClass, setNewClass] = useState({
    classId: '',
    slots: [{ slot: '', day: '' }]
  })

  // Giả sử đây là hàm để lấy dữ liệu các lớp học từ API
  useEffect(() => {
    const fetchAvailableClasses = async () => {
      // Gọi API để lấy các lớp học chưa có lịch
      const response = await fetch('/api/classes-without-schedule')
      const data = await response.json()
      setAvailableClasses(data)
    }

    fetchAvailableClasses()
  }, [])

  const handleAddSlot = () => {
    if (newClass.slots.length < 3) {
      setNewClass({
        ...newClass,
        slots: [...newClass.slots, { slot: '', day: '' }]
      })
    }
  }

  const handleRemoveSlot = (index) => {
    const updatedSlots = [...newClass.slots]
    updatedSlots.splice(index, 1)
    setNewClass({
      ...newClass,
      slots: updatedSlots
    })
  }

  const handleInputChange = (value, field, index = null) => {
    if (field === 'classId') {
      setNewClass({ ...newClass, classId: value })
    } else if (field === 'slot' || field === 'day') {
      const updatedSlots = [...newClass.slots]
      updatedSlots[index][field] = value
      setNewClass({ ...newClass, slots: updatedSlots })
    }
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    console.log('New class with slots:', newClass)
    // Thêm lớp học vào lịch học ở đây (có thể gọi API)
    setIsModalVisible(false)
    setNewClass({
      classId: '',
      slots: [{ slot: '', day: '' }]
    })
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  useEffect(() => {
    const fetchWeekData = async () => {
      const weekStart = addWeeks(startOfYear(new Date(parseInt(selectedYear), 0, 1)), parseInt(selectedWeek) - 1)
      const weekEnd = addDays(weekStart, 6)

      setWeekData({
        year: selectedYear,
        week: {
          startDate: format(weekStart, 'yyyy-MM-dd'),
          endDate: format(weekEnd, 'yyyy-MM-dd')
        },
        courses: mockCourses
      })
    }

    fetchWeekData()
  }, [selectedYear, selectedWeek])

  const weekDates = useMemo(() => {
    if (!weekData) return []
    const startDate = parse(weekData.week.startDate, 'yyyy-MM-dd', new Date())
    return Array.from({ length: 7 }, (_, i) => addDays(startDate, i))
  }, [weekData])

  const courseOptions = useMemo(() => {
    const uniqueCourses = [...new Set(mockCourses.map(course => course.name))]
    return uniqueCourses.map(course => ({ value: course, label: course }))
  }, [])

  const instructorOptions = useMemo(() => {
    const uniqueInstructors = [...new Set(mockCourses.map(course => course.instructor))]
    return uniqueInstructors.map(instructor => ({ value: instructor, label: instructor }))
  }, [])

  const filteredCourses = useMemo(() => {
    return mockCourses.filter(course => {
      const matchesCourse = selectedCourse ? course.name === selectedCourse : true
      const matchesInstructor = selectedInstructor ? course.instructor === selectedInstructor : true
      return matchesCourse && matchesInstructor
    })
  }, [selectedCourse, selectedInstructor])

  if (!weekData) {
    return <div>Loading...</div>
  }

  return (
    <div className="container">
      <Card>
        <div className="selectors">
          <Select
            value={selectedYear}
            onChange={setSelectedYear}
            options={years.map(year => ({ value: year, label: year }))}
            style={{ width: 100 }}
          />
          <Select
            value={selectedWeek}
            onChange={setSelectedWeek}
            options={weeks}
            style={{ width: 200 }}
          />
          <Select
            value={selectedCourse}
            onChange={setSelectedCourse}
            options={[{ value: '', label: 'All Courses' }, ...courseOptions]}
            style={{ width: 200 }}
          />
          <Select
            value={selectedInstructor}
            onChange={setSelectedInstructor}
            options={[{ value: '', label: 'All Instructors' }, ...instructorOptions]}
            style={{ width: 200 }}
          />
          <Button type="primary" onClick={showModal}>
            Thêm lịch học
          </Button>
          <Modal
            title="Thêm lịch học"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <Form layout="vertical">
              <Form.Item label="Chọn lớp học">
                <Select
                  value={newClass.classId}
                  onChange={(value) => handleInputChange(value, 'classId')}
                  options={availableClasses.map(cls => ({ value: cls.id, label: cls.name }))}
                />
              </Form.Item>

              {newClass.slots.map((slot, index) => (
                <Row key={index} gutter={16}>
                  <Col span={12}>
                    <Form.Item label={`Slot học ${index + 1}`}>
                      <Select
                        value={slot.slot}
                        onChange={(value) => handleInputChange(value, 'slot', index)}
                        options={slots.map((slot, i) => ({ value: i + 1, label: slot }))}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Ngày học">
                      <Select
                        value={slot.day}
                        onChange={(value) => handleInputChange(value, 'day', index)}
                        options={daysOfWeek.map((day, i) => ({ value: i, label: day }))}
                      />
                    </Form.Item>
                  </Col>
                  {newClass.slots.length > 1 && (
                    <Button type="link" onClick={() => handleRemoveSlot(index)}>
                      Xóa slot
                    </Button>
                  )}
                </Row>
              ))}

              {newClass.slots.length < 3 && (
                <Button type="dashed" onClick={handleAddSlot}>
                  Thêm slot học
                </Button>
              )}
            </Form>
          </Modal>
        </div>
        <div className="table-container">
          <table className="schedule-table">
            <thead>
              <tr>
                <th></th>
                {weekDates.map((date, index) => (
                  <th key={index}>
                    <div className="day-header">
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
                  <td className="slot-cell">{slot}</td>
                  {weekDates.map((_, dayIndex) => {
                    const slotCourses = filteredCourses.filter(c => c.slot === parseInt(slot.split(' ')[1]) && c.day === dayIndex)
                    return (
                      <td key={dayIndex} className="course-cell">
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
                            <div className="course-item">
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
      </Card>
    </div>
  )
}

export default ClassSchedule;