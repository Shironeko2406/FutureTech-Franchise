import { createSlice } from "@reduxjs/toolkit";
import { httpClient, USER_LOGIN } from "../../Utils/Interceptors";
import { message } from "antd";
import { GetAssignmentDetailByIdActionAsync, GetAssignmentsByClassIdActionAsync } from "./AssignmentReducer";
import { getDataJSONStorage, setDataJSONStorage } from "../../Utils/UtilsFunction";
import { setUserLogin } from "./AuthenticationReducer";
import { dark } from "@mui/material/styles/createPalette";

const initialState = {
  userData: [],
  userProfile: {},
  schedules: [],
  classOfUserLogin: [],
  userManager: [],
  taskUser: [],
  totalPagesCount: 0,
  accounts: [],
  totalItemsCount: 0
};

const UserReducer = createSlice({
  name: "UserReducer",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    setSchedules: (state, action) => {
      state.schedules = action.payload;
    },
    setCLassOfUserLogin: (state, action) => {
      state.classOfUserLogin = action.payload;
    },
    setUserManager: (state, action) => {
      state.userManager = action.payload;
    },
    setTaskUser: (state, action) => {
      state.taskUser = action.payload.items;
      state.totalPagesCount = action.payload.totalPagesCount;
    },
    setAccounts: (state, action) => {
      state.accounts = action.payload.items;
      state.totalItemsCount = action.payload.totalItemsCount;
      state.totalPagesCount = action.payload.totalPagesCount;
    }
  },
});

export const {
  setUserData,
  setUserProfile,
  setSchedules,
  setCLassOfUserLogin, setAccounts,
  setUserManager,
  setTaskUser
} = UserReducer.actions;

export default UserReducer.reducer;
//------------API-CALL-------
export const CreateUserActionAsync = (user) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(`/agency-manager/api/v1/users`, user);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        return true;
      } else {
        message.error(`${res.message}`);
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };
};

export const CreateUserUploadFileActionAsync = (file) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(
        `/agency-manager/api/v1/users/files`,
        file
      );
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        return true;
      } else {
        message.error(`${res.message}`);
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };
};

export const ChangePasswordActionAsync = (passwordData) => {
  return async (dispatch) => {
    try {
      // Gọi API đổi mật khẩu
      console.log(passwordData);
      const res = await httpClient.post(
        `/api/v1/users/change-password`,
        passwordData
      );

      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        return true;
      } else if (res.isSuccess && !res.data) {
        message.error(`${res.message}`);
        return false;
      } else {
        throw new Error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
      return false;
    }
  };
};

export const GetUserLoginActionAsync = () => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/api/v1/users/mine`);
      if (res.isSuccess && res.data) {
        dispatch(setUserProfile(res.data));
      } else {
        message.error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
    }
  };
};

export const GetCheckStatusAgencyLoginActionAsync = () => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/api/v1/users/mine`);
      if (res.isSuccess && res.data) {
        const agencyLogin = getDataJSONStorage(USER_LOGIN);
        console.log("đang check")
        if (agencyLogin?.status && res.data.status !== agencyLogin.status) { // kiểm tra status re.data.status trả về có giống statusAgencyLogin hay ko
          const updatedAgencyLogin = { ...agencyLogin, status: res.data.status };
          setDataJSONStorage(USER_LOGIN, updatedAgencyLogin);

          dispatch(setUserLogin(updatedAgencyLogin));
        }
        //
      } else {
        message.error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
    }
  };
};

export const GetClassSchedulesByLoginActionAsync = (startDate, endDate) => {
  return async (dispatch) => {
    try {
      console.log(
        "GetClassSchedulesByLoginActionAsync, startDate: ",
        startDate
      );
      console.log("GetClassSchedulesByLoginActionAsync, endDate: ", endDate);
      const response = await httpClient.get(
        `/api/v1/users/mine/class-schedules`,
        {
          params: {
            startTime: startDate,
            endTime: endDate,
          },
        }
      );
      if (response.isSuccess) {
        dispatch(setSchedules(response.data));
        console.log(
          "GetClassSchedulesByLoginActionAsync, response: ",
          response.data
        );
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error(error);
      message.error("Không thể lấy lịch học, vui lòng thử lại sau.");
    }
  };
};

export const GetClassOfUserLoginActionAsync = () => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/api/v1/users/mine/classes`);
      if (res.isSuccess && res.data) {
        dispatch(setCLassOfUserLogin(res.data));
      } else {
        message.error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
    }
  };
};

export const GetManagerUserAddAppointmentActionAsync = (filter) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/manager/api/v1/users`, {
        params: {
          StartTime: filter.startTimeFilter,
          EndTime: filter.endTimeFilter,
        },
      });
      const filteredUsers = res.data.filter((user) =>
        ["Manager", "SystemInstructor", "SystemTechnician", "AgencyManager", "SystemConsultant"].includes(user.role)
      );
      dispatch(setUserManager(filteredUsers));
    } catch (error) {
      console.error(error);
    }
  };
};

export const GetTaskUserByLoginActionAsync = (search, level, status, submit, pageIndex, pageSize) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/api/v1/users/mine/works`, {
        params: { Search: search, Level: level, Status: status, Submit: submit, PageIndex: pageIndex, PageSize: pageSize }
      });
      console.log("GetTaskUserByLoginActionAsync, response: ", res.data);
      dispatch(setTaskUser(res.data));
    } catch (error) {
      console.error(error);
    }
  };
};

export const StudentSubmitAssignmentActionAsync = (data) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(
        `/api/v1/users/mine/assignments`,
        null, { params: { assignmentId: data.assignmentId, fileSubmitUrl: data.fileUrl, fileSubmitName: data.fileName } });
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        await dispatch(GetAssignmentDetailByIdActionAsync(data.assignmentId))
        return true;
      } else {
        message.error(`${res.message}`);
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };
}

export const InstructorGradeForAssignmentActionAsync = (usersScores, classId) => {
  return async (dispatch) => {
    try {
      // Create an array of POST request promises for each score
      const promises = usersScores.map((dataScore) =>
        httpClient.post(`/instructor/api/v1/scores`, dataScore)
      );

      // Wait for all requests to complete using Promise.all
      const responses = await Promise.all(promises);

      // Check if all responses are successful
      const allSuccessful = responses.every(res => res.isSuccess && res.data);

      if (allSuccessful) {
        message.success('Chấm điểm thành công!');
        await dispatch(GetAssignmentsByClassIdActionAsync(classId)); // Dispatch the action after successful submission
        return true;
      } else {
        message.error('There was an issue with one or more submissions');
        return false;
      }
    } catch (error) {
      console.error(error);
      message.error('An error occurred while submitting scores');
      return false;
    }
  };
};


export const GetAccountsActionAsync = (search, isActive, role, pageIndex, pageSize) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/agency-manager/api/v1/users`, {
        params: {
          Search: search,
          IsActive: isActive,
          Role: role,
          PageIndex: pageIndex,
          PageSize: pageSize,
        },
      });
      if (res.isSuccess && res.data) {
        dispatch(setAccounts(res.data));
      } else {
        message.error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
      message.error("Không thể lấy danh sách tài khoản, vui lòng thử lại sau.");
    }
  };
};

export const GetAdminAccountsActionAsync = (search, isActive, agencyId, role, pageIndex, pageSize) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.get(`/admin/api/v1/users`, {
        params: {
          Search: search,
          IsActive: isActive,
          AgencyId: agencyId,
          Role: role,
          PageIndex: pageIndex,
          PageSize: pageSize,
        },
      });
      if (res.isSuccess && res.data) {
        dispatch(setAccounts(res.data));
      } else {
        message.error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
      message.error("Không thể lấy danh sách tài khoản, vui lòng thử lại sau.");
    }
  };
};

export const CreateAccountByAgencyManagerActionAsync = (accountData) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(`/agency-manager/api/v1/users`, accountData);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        return true;
      } else if (res.isSuccess && !res.data) {
        message.error(`${res.message}`);
        return false;
      } else {
        throw new Error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
      return false;
    }
  };
};

export const ToggleAccountStatusByAgencyManagerActionAsync = (id) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.put(`/agency-manager/api/v1/users/${id}/status`);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        return true;
      } else if (res.isSuccess && !res.data) {
        message.error(`${res.message}`);
        return false;
      } else {
        throw new Error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
      return false;
    }
  };
};

export const ToggleAccountStatusByAdminActionAsync = (id) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.put(`/admin/api/v1/users/${id}/status`);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        return true;
      } else if (res.isSuccess && !res.data) {
        message.error(`${res.message}`);
        return false;
      } else {
        throw new Error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
      return false;
    }
  };
};

export const UpdateUserByAdminActionAsync = (id, userData) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.put(`/admin/api/v1/users?id=${id}`, userData);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        return true;
      } else if (res.isSuccess && !res.data) {
        message.error(`${res.message}`);
        return false;
      } else {
        throw new Error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
      return false;
    }
  };
};

export const CreateAccountByAdminActionAsync = (accountData) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.post(`/admin/api/v1/users`, accountData);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        return true;
      } else if (res.isSuccess && !res.data) {
        message.error(`${res.message}`);
        return false;
      } else {
        throw new Error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
      return false;
    }
  };
};

export const UpdateUserByAgencyManagerActionAsync = (id, userData) => {
  return async (dispatch) => {
    try {
      const res = await httpClient.put(`/agency-manager/api/v1/users?id=${id}`, userData);
      if (res.isSuccess && res.data) {
        message.success(`${res.message}`);
        return true;
      } else if (res.isSuccess && !res.data) {
        message.error(`${res.message}`);
        return false;
      } else {
        throw new Error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
      return false;
    }
  };
};

export const UpdateUserAccountByLoginActionAsync = (dataUpdate) => {
  return async (dispatch) => {
    try {
      const currentUser = getDataJSONStorage(USER_LOGIN)
      const res = await httpClient.put(`/api/v1/users`, dataUpdate);
      if (res.isSuccess && res.data) {
        const updatedUser = { ...currentUser, ...dataUpdate };
        await Promise.all([
          dispatch(GetUserLoginActionAsync()),
          dispatch(setUserLogin(updatedUser))
        ]);
        setDataJSONStorage(USER_LOGIN, updatedUser)
        message.success(`${res.message}`);
        return true;
      } else if (res.isSuccess && !res.data) {
        message.error(`${res.message}`);
        return false;
      } else {
        throw new Error(`${res.message}`);
      }
    } catch (error) {
      console.error(error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
      return false;
    }
  };
};
