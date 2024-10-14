import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    notificationData:[]
}

const NotificationReducer = createSlice({
  name: "NotificationReducer",
  initialState,
  reducers: {}
});

export const {} = NotificationReducer.actions

export default NotificationReducer.reducer