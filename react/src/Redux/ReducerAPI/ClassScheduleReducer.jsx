import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    classSchedules: []
}

const ClassScheduleReducer = createSlice({
  name: "ClassScheduleReducer",
  initialState,
  reducers: {}
});

export const {} = ClassScheduleReducer.actions

export default ClassScheduleReducer.reducer