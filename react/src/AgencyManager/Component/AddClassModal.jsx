import React from 'react'
import { Modal, Form, Select, Button, Row, Col, message } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { hideModal, setNewClass, addSlot, removeSlot, saveNewClass } from '../../Redux/ReducerAPI/ClassScheduleReducer'

const slots = Array.from({ length: 8 }, (_, i) => `Slot ${i + 1}`)
const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

export default function AddClassModal() {
    const dispatch = useDispatch()
    const { isModalVisible, newClass, availableClasses } = useSelector((state) => state.ClassScheduleReducer)
    const [form] = Form.useForm()

    const handleInputChange = (value, field, index = null) => {
        dispatch(setNewClass({ value, field, index }))
    }

    const handleAddSlot = () => {
        if (newClass.slots.length < 5) {
            dispatch(addSlot())
        } else {
            message.warning('Bạn chỉ có thể thêm tối đa 5 slot học.')
        }
    }

    const handleSave = () => {
        form.validateFields().then(() => {
            // Check for duplicate slots
            const slotSet = new Set()
            for (let slot of newClass.slots) {
                const slotKey = `${slot.slot}-${slot.day}`
                if (slotSet.has(slotKey)) {
                    message.error('Các slot học không được trùng nhau.')
                    return
                }
                slotSet.add(slotKey)
            }
            dispatch(saveNewClass())
        }).catch((errorInfo) => {
            console.log('Validation failed:', errorInfo)
        })
    }

    return (
        <Modal
            title="Thêm lịch học"
            visible={isModalVisible}
            onOk={handleSave}
            onCancel={() => dispatch(hideModal())}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="classId"
                    label="Chọn lớp học"
                    rules={[{ required: true, message: 'Vui lòng chọn lớp học' }]}
                >
                    <Select
                        value={newClass.classId}
                        onChange={(value) => handleInputChange(value, 'classId')}
                        options={availableClasses.map(cls => ({ value: cls.id, label: cls.name }))}
                    />
                </Form.Item>

                {newClass.slots.map((slot, index) => (
                    <Row key={index} gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name={['slots', index, 'slot']}
                                label={`Slot học ${index + 1}`}
                                rules={[{ required: true, message: 'Vui lòng chọn slot học' }]}
                            >
                                <Select
                                    value={slot.slot}
                                    onChange={(value) => handleInputChange(value, 'slot', index)}
                                    options={slots.map((slot, i) => ({ value: i + 1, label: slot }))}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name={['slots', index, 'day']}
                                label="Ngày học"
                                rules={[{ required: true, message: 'Vui lòng chọn ngày học' }]}
                            >
                                <Select
                                    value={slot.day}
                                    onChange={(value) => handleInputChange(value, 'day', index)}
                                    options={daysOfWeek.map((day, i) => ({ value: i, label: day }))}
                                />
                            </Form.Item>
                        </Col>
                        {newClass.slots.length > 1 && (
                            <Button type="link" onClick={() => dispatch(removeSlot(index))}>
                                Xóa slot
                            </Button>
                        )}
                    </Row>
                ))}

                {newClass.slots.length < 5 && (
                    <Button type="dashed" onClick={handleAddSlot}>
                        Thêm slot học
                    </Button>
                )}
            </Form>
        </Modal>
    )
}