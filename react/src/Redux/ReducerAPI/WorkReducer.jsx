import { createSlice } from '@reduxjs/toolkit'
import { httpClient } from '../../Utils/Interceptors';
import { message } from 'antd';
import { GetTaskByAgencyIdActionAsync } from './AgencyReducer';
import { GetTaskUserByLoginActionAsync } from './UserReducer';

const initialState = {
  taskDetail: {}
}

const WorkReducer = createSlice({
  name: "WorkReducer",
  initialState,
  reducers: {
    setTaskDetail: (state, action) => {
      state.taskDetail = action. payload
    }
  }
});

export const {setTaskDetail} = WorkReducer.actions

export default WorkReducer.reducer
//------------API CALL----------------
export const CreateTaskActionAsync = (data) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(`/api/v1/works`, data);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        await dispatch(GetTaskByAgencyIdActionAsync(data.agencyId));
        return true;
      } else {
        message.error(`Lỗi hệ thống`);
        return false;
      }
    } catch (error) {
      console.log(error);
      message.error("Lỗi hệ thống");
    }
  };
};

export const GetTaskDetailByIdActionAsync = (id) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/api/v1/works/${id}`);
      dispatch(setTaskDetail(res.data))
    } catch (error) {
      console.log(error);
      message.error("Lỗi hệ thống");
    }
  };
};

export const UpdateStatusTaskByIdActionAsync = (id, status, agencyId) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.put(`/manager/api/v1/works/${id}`, null, {params: {status: status}});
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        await Promise.all([
          dispatch(GetTaskDetailByIdActionAsync(id)),
          dispatch(GetTaskByAgencyIdActionAsync(agencyId))
        ]);
        return true;
      } else {
        message.error(`${res.message}`);
        return false;
      }
    } catch (error) {
      console.log(error);
      message.error("Lỗi hệ thống");
    }
  };
};

export const DeleteTaskByIdActionAsync = (taskId, agencyId) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.delete(`/api/v1/works/${taskId}`);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        await dispatch(GetTaskByAgencyIdActionAsync(agencyId));
        return true;
      } else {
        message.error(`Lỗi hệ thống`);
        return false;
      }
    } catch (error) {
      console.log(error);
      message.error("Lỗi hệ thống");
    }
  };
};

export const EditTaskByIdActionAsync = (dataUpdate, taskId, agencyId) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.put(`/api/v1/works/${taskId}`, dataUpdate);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        await dispatch(GetTaskByAgencyIdActionAsync(agencyId));
        return true;
      } else {
        message.error(`${res.message}`);
        return false;
      }
    } catch (error) {
      console.log(error);
      message.error("Lỗi hệ thống");
    }
  };
};

export const StaffSubmitReportTaskByIdActionAsync = (data, taskId) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.put(`/staff/api/v1/works/${taskId}`, data);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        await dispatch(GetTaskDetailByIdActionAsync(taskId));
        return true;
      } else {
        message.error(`${res.message}`);
        return false;
      }
    } catch (error) {
      console.log(error);
      message.error("Lỗi hệ thống");
    }
  };
};

export const UpdateStatusSubmitByTaskByIdActionAsync = (status, workId, filters, pageIndex, pageSize) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.put(`/staff/api/v1/works/${workId}/status`, null,{
        params: {
          workStatusSubmitEnum: status,
        },
      } );
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        await Promise.all([
          dispatch(GetTaskDetailByIdActionAsync(workId)),
          dispatch(GetTaskUserByLoginActionAsync(filters.searchText, filters.levelFilter, filters.statusFilter, filters.submitFilter, pageIndex, pageSize))
        ]);
        return true;
      } else {
        message.error(`${res.message}`);
        return false;
      }
    } catch (error) {
      console.log(error);
      message.error("Lỗi hệ thống");
    }
  };
};