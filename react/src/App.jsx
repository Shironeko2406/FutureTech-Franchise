import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import "./App.css";
import Home from "./Admin/Page/Home/Home";
import { store } from "./Redux/Store";
import TempUI from "./Admin/TempUI/TempUI";
import Login from "./Admin/Page/Login/Login";
import Register from "./Admin/Page/Register/Register";
import FranchiseManagement from "./Admin/Page/FranchiseManagement/FranchiseManagement";
import ProtectedRoute from "./Utils/ProtectedRoute";
import AnonymousRoute from "./Utils/AnonymousRoute ";
import HomeInstructor from "./Instructor/Page/HomeInstructor";
import ForgotPassword from "./Admin/Page/ForgotPassword/ForgotPassword";
import ResetPassword from "./Admin/Page/ForgotPassword/ResetPassword";
import TempUIManager from "./Manager/TempUI/TempUIManager";
import HomeManager from "./Manager/Page/Home/HomeManager";
import ClassSchedule from "./AgencyManager/Page/ClassSchedule/ClassSchedule";
import ConsultationManagement from "./Manager/Page/ConsultationManagement/ConsultationManagement";
import TempUIStudent from "./Student/TempUI/TempUIStudent";
import HomeStudent from "./Student/Page/HomeStudent/HomeStudent";
import CourseDetail from "./Student/Page/CourseDetail/CourseDetail";
import HomeStudentNoti from "./Student/Page/HomeStudentNoti";
import TempUIAgencyManager from "./AgencyManager/TempUIAgencyManager/TempUIAgencyManager";
import HomeAgencyManager from "./AgencyManager/Page/HomeAgencyManager/HomeAgencyManager";
import CourseManager from "./Manager/Page/Course/CourseManager";
import CourseAdmin from "./Admin/Page/Course/CourseAdmin";
import SlotManager from "./Manager/Page/Slot/SlotManager";
import ChangePassword from "./Student/Page/ChangePassword/ChangePassword";
import StudentClassSchedule from "./Student/Page/ClassSchedule/StudentClassSchedule";
import TempUIInstructor from "./Instructor/TempUI/TempUIInstructor";
import InstructorClassSchedule from "./Instructor/Page/ClassSchedule/InstructorClassSchedule";

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Routes>
          <Route element={<AnonymousRoute />}>
            <Route path="" element={<Login></Login>} />
            <Route path="register" element={<Register></Register>} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route
              path="forgot-password/reset-password"
              element={<ResetPassword />}
            />
          </Route>
          <Route element={<ProtectedRoute requiredRole="Administrator" />}>
            <Route path="admin" element={<TempUI />}>
              <Route path="" element={<Home />} />
              <Route path="franchise" element={<FranchiseManagement />} />
              <Route path="course" element={<CourseAdmin />} />
            </Route>
          </Route>

          {/* <Route element={<ProtectedRoute requiredRole="AgencyManager" />}> */}
          <Route path="agency-manager" element={<TempUIAgencyManager />} >
            <Route path="" element={<HomeAgencyManager />} />
            <Route path="class-schedule" element={<ClassSchedule />} />
          </Route>
          {/* </Route> */}

          {/* <Route element={<ProtectedRoute requiredRole="Student" />}> */}
          <Route path="student" element={<TempUIStudent />} >
            <Route path="" element={<HomeStudentNoti />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="class-schedule" element={<StudentClassSchedule />} />
          </Route>
          {/* </Route> */}

          <Route path="student-page" element={<TempUIStudent />} >
            <Route path="" element={<HomeStudent />} />
            <Route path="course-detail" element={<CourseDetail />} />

          </Route>

          {/* <Route element={<ProtectedRoute requiredRole="Instructor" />}> */}
          <Route path="instructor" element={<TempUIInstructor />}>
            <Route path="" element={<HomeInstructor />} />
            <Route path="class-schedule" element={<InstructorClassSchedule />} />
          </Route>
          {/* </Route> */}

          <Route element={<ProtectedRoute requiredRole="Manager" />}>
            <Route path="manager" element={<TempUIManager />}>
              <Route path="" element={<HomeManager />} />
              <Route path="consult" element={<ConsultationManagement />} />
              <Route path="course" element={<CourseManager />} />
              <Route path="slot" element={<SlotManager />} />

            </Route>
          </Route>
        </Routes>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
