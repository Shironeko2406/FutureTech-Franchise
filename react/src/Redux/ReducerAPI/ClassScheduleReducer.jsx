import { createSlice } from '@reduxjs/toolkit'
import { addDays, format, startOfYear, addWeeks, endOfYear, differenceInWeeks } from 'date-fns'

const initialState = {
    selectedYear: new Date().getFullYear().toString(),
    selectedWeek: '1',
    selectedCourse: '',
    selectedInstructor: '',
    weekData: null,
    loading: false,
    years: [],
    weeks: [],
    courseOptions: [],
    instructorOptions: [],
    filteredCourses: [],
    isModalVisible: false,
    newClass: {
        classId: '',
        slots: [{ slot: '', day: '' }]
    },
    availableClasses: []
}

const ClassScheduleReducer = createSlice({
    name: 'ClassScheduleReducer',
    initialState,
    reducers: {
        setYear: (state, action) => {
            state.selectedYear = action.payload
        },
        setWeek: (state, action) => {
            state.selectedWeek = action.payload
        },
        setCourse: (state, action) => {
            state.selectedCourse = action.payload
        },
        setInstructor: (state, action) => {
            state.selectedInstructor = action.payload
        },
        setWeekData: (state, action) => {
            state.weekData = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setYears: (state, action) => {
            state.years = action.payload
        },
        setWeeks: (state, action) => {
            state.weeks = action.payload
        },
        setCourseOptions: (state, action) => {
            state.courseOptions = action.payload
        },
        setInstructorOptions: (state, action) => {
            state.instructorOptions = action.payload
        },
        setFilteredCourses: (state, action) => {
            state.filteredCourses = action.payload
        },
        showModal: (state) => {
            state.isModalVisible = true
        },
        hideModal: (state) => {
            state.isModalVisible = false
        },
        setNewClass: (state, action) => {
            const { value, field, index } = action.payload
            if (field === 'classId') {
                state.newClass.classId = value
            } else if (field === 'slot' || field === 'day') {
                state.newClass.slots[index][field] = value
            }
        },
        addSlot: (state) => {
            if (state.newClass.slots.length < 5) {
                state.newClass.slots.push({ slot: '', day: '' })
            }
        },
        removeSlot: (state, action) => {
            state.newClass.slots.splice(action.payload, 1)
        },
        setAvailableClasses: (state, action) => {
            state.availableClasses = action.payload
        }
    }
})

export const {
    setYear,
    setWeek,
    setCourse,
    setInstructor,
    setWeekData,
    setLoading,
    setYears,
    setWeeks,
    setCourseOptions,
    setInstructorOptions,
    setFilteredCourses,
    showModal,
    hideModal,
    setNewClass,
    addSlot,
    removeSlot,
    setAvailableClasses
} = ClassScheduleReducer.actions

// Thunk for fetching week data
export const fetchWeekData = () => async (dispatch, getState) => {
    const { selectedYear, selectedWeek } = getState().ClassScheduleReducer
    dispatch(setLoading(true))
    try {
        // Simulating API call
        const weekStart = addWeeks(startOfYear(new Date(parseInt(selectedYear), 0, 1)), parseInt(selectedWeek) - 1)
        const weekEnd = addDays(weekStart, 6)
        const mockCourses = [
            { id: "1", code: "CSE101", name: "Introduction to Computer Science", location: "Room A101", instructor: "Dr. Smith", slot: 1, day: 0 },
            { id: "2", code: "MAT201", name: "Linear Algebra", location: "Room B202", instructor: "Prof. Johnson", slot: 2, day: 1 },
            { id: "2", code: "MAT201", name: "Linear Algebra", location: "Room B202", instructor: "Prof. Johnson", slot: 2, day: 2 },
            { id: "2", code: "MAT201", name: "Linear Algebra", location: "Room B202", instructor: "Prof. Johnson", slot: 2, day: 3 },
            { id: "2", code: "MAT201", name: "Linear Algebra", location: "Room B202", instructor: "Prof. Johnson", slot: 2, day: 4 },
            { id: "2", code: "MAT201", name: "Linear Algebra", location: "Room B202", instructor: "Prof. Johnson", slot: 2, day: 5 },
            { id: "2", code: "MAT201", name: "Linear Algebra", location: "Room B202", instructor: "Prof. Johnson", slot: 2, day: 5 },
            { id: "2", code: "MAT201", name: "Linear Algebra", location: "Room B202", instructor: "Prof. Johnson", slot: 2, day: 5 },
            // { id: "2", code: "MAT201", name: "Linear Algebra", location: "Room B202", instructor: "Prof. Johnson", slot: 2, day: 6 },
            // ... other courses
        ]
        const weekData = {
            year: selectedYear,
            week: {
                startDate: format(weekStart, 'yyyy-MM-dd'),
                endDate: format(weekEnd, 'yyyy-MM-dd')
            },
            courses: mockCourses
        }
        dispatch(setWeekData(weekData))
        dispatch(setFilteredCourses(mockCourses))
        // Set other derived state
        dispatch(setYears([selectedYear]))
        dispatch(setWeeks(generateWeeks(parseInt(selectedYear))))
        dispatch(setCourseOptions(generateCourseOptions(mockCourses)))
        dispatch(setInstructorOptions(generateInstructorOptions(mockCourses)))
    } catch (error) {
        console.error('Error fetching week data:', error)
    } finally {
        dispatch(setLoading(false))
    }
}

// Thunk for saving new class
export const saveNewClass = () => async (dispatch, getState) => {
    const { newClass } = getState().ClassScheduleReducer
    try {
        // Simulating API call to save new class
        console.log('Saving new class:', newClass)
        // After successful save, you might want to refresh the week data
        dispatch(fetchWeekData())
        dispatch(hideModal())
    } catch (error) {
        console.error('Error saving new class:', error)
    }
}

// Helper functions
const generateWeeks = (year) => {
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
}

const generateCourseOptions = (courses) => {
    const uniqueCourses = [...new Set(courses.map(course => course.name))]
    return uniqueCourses.map(course => ({ value: course, label: course }))
}

const generateInstructorOptions = (courses) => {
    const uniqueInstructors = [...new Set(courses.map(course => course.instructor))]
    return uniqueInstructors.map(instructor => ({ value: instructor, label: instructor }))
}

export default ClassScheduleReducer.reducer