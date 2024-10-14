import { createSlice } from '@reduxjs/toolkit'
import { httpClient } from '../../Utils/Interceptors';
import { message } from 'antd';

const initialState = {
    courseCategory: []
}

const CourseCategoryReducer = createSlice({
  name: "CourseCategoryReducer",
  initialState,
  reducers: {
    setCourseCategory: (state, action)=>{
      state.courseCategory = action.payload
    }
  }
});

export const {setCourseCategory, } = CourseCategoryReducer.actions

export default CourseCategoryReducer.reducer
//----------API CALL--------------
export const GetCourseCategoryActionAsync = () => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(
        `/api/v1/course-categories`
      );
      dispatch(setCourseCategory(res.data))
    } catch (error) {
      console.error(error);
    }
  };
};

export const DeleteCourseCategoryActionAsync = (id) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.delete(
        `/api/v1/course-categories/${id}`
      );
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        dispatch(GetCourseCategoryActionAsync())
        return true;
      } else {
        message.error(`${res.message}`);
        return false;
      }
    } catch (error) {
      console.error(error);
    }
  };
};