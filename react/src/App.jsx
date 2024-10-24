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
import ForgotPassword from "./Admin/Page/ForgotPassword/ForgotPassword";
import ResetPassword from "./Admin/Page/ForgotPassword/ResetPassword";
import TempUIManager from "./Manager/TempUI/TempUIManager";
import HomeManager from "./Manager/Page/Home/HomeManager";
import ConsultationManagement from "./Manager/Page/ConsultationManagement/ConsultationManagement";
import TempUIStudent from "./Student/TempUI/TempUIStudent";
import HomeStudent from "./Student/Page/HomeStudent/HomeStudent";
import CourseDetail from "./Student/Page/CourseDetail/CourseDetail";
import HomeStudentNoti from "./Student/Page/HomeStudentNoti";
import TempUIAgencyManager from "./AgencyManager/TempUIAgencyManager/TempUIAgencyManager";
import HomeAgencyManager from "./AgencyManager/Page/HomeAgencyManager/HomeAgencyManager";
import SlotManager from "./Manager/Page/Slot/SlotManager";
import Profile from "./Admin/Page/Profile/Profile";
import ChangePassword from "./Student/Page/ChangePassword/ChangePassword";
import ScheduleStudent from "./Student/Page/Schedule/ScheduleStudent";
import CourseCategoryManager from "./Manager/Page/CourseCategory/CourseCategoryManager";
import CourseManage from "./Manager/Page/CorseManager/CourseManage";
import CourseCategoryAdmin from "./Admin/Page/CourseCategory/CourseAdmin";
import CourseManageAdmin from "./Admin/Page/CourseManageAdmin/CourseManageAdmin";
import TempUIInstructor from "./Instructor/TempUIInstructor/TempUIInstructor";
import ScheduleTeaching from "./Instructor/Page/ScheduleTeaching/ScheduleTeaching";
import HomeInstructor from "./Instructor/Page/HomeInstructor/HomeInstructor";
import CourseDetailManager from "./Manager/Page/CourseDetailManager/CourseDetailManager";

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
              <Route path="course-category" element={<CourseCategoryAdmin />} />
              <Route path="course" element={<CourseManageAdmin />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute requiredRole="AgencyManager" />}>
            <Route path="agency-manager" element={<TempUIAgencyManager />}>
              <Route path="" element={<HomeAgencyManager />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute requiredRole="Student" />}>
            <Route path="student" element={<TempUIStudent />}>
              <Route path="" element={<HomeStudentNoti />} />
              <Route path="schedule" element={<ScheduleStudent />} />
              <Route path="change-password" element={<ChangePassword />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute requiredRole="Instructor" />}>
            <Route path="instructor" element={<TempUIInstructor />}>
              <Route path="" element={<HomeInstructor/>} />
              <Route path="schedule" element={<ScheduleTeaching/>} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute requiredRole="Manager" />}>
            <Route path="manager" element={<TempUIManager />}>
              <Route path="" element={<HomeManager />} />
              <Route path="consult" element={<ConsultationManagement />} />
              <Route path="course-category" element={<CourseCategoryManager />} />
              <Route path="course" element={<CourseManage />} />
              <Route path="course-detail/:id" element={<CourseDetailManager/>} />
              <Route path="slot" element={<SlotManager />} />
            </Route>
          </Route>

          {/*Test page */}
          <Route path="student-page" element={<TempUIStudent />}>
            <Route path="" element={<HomeStudent />} />
            <Route path="course-detail" element={<CourseDetail />} />
          </Route>
        </Routes>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
