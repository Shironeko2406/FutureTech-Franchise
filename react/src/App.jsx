import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
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
import TempUIStudent from "./Student/TempUI/TempUIStudent";
import HomeStudent from "./Student/Page/HomeStudent/HomeStudent";
import ClassDetailStudent from "./Student/Page/ClassDetailStudent/ClassDetailStudent";
import HomeStudentNoti from "./Student/Page/HomeStudentNoti";
import TempUIAgencyManager from "./AgencyManager/TempUIAgencyManager/TempUIAgencyManager";
import HomeAgencyManager from "./AgencyManager/Page/HomeAgencyManager/HomeAgencyManager";
import Profile from "./Admin/Page/Profile/Profile";
import ChangePassword from "./Student/Page/ChangePassword/ChangePassword";
import SlotManager from "./AgencyManager/Page/Slot/SlotManager";
import ScheduleStudent from "./Student/Page/Schedule/ScheduleStudent";
import CourseCategoryManager from "./Manager/Page/CourseCategory/CourseCategoryManager";
import CourseManage from "./Manager/Page/CorseManager/CourseManage";
import ScheduleInstructor from "./Instructor/Page/Schedule/ScheduleInstructor";
import StudentConsultationRegistration from "./AgencyManager/Page/StudentConsultationRegistration/StudentConsultationRegistration";
import StudentPaymentManagement from "./AgencyManager/Page/StudentPaymentManagement/StudentPaymentManagement";
import ClassManagement from "./AgencyManager/Page/ClassManagement/ClassManagement";
import ClassDetail from "./AgencyManager/Page/ClassManagement/ClassDetail";
import ScheduleAgencyManager from "./AgencyManager/Page/ScheduleManagement/ScheduleAgencyManager";
import CourseCategoryAdmin from "./Admin/Page/CourseCategory/CourseAdmin";
import CourseManageAdmin from "./Admin/Page/CourseManageAdmin/CourseManageAdmin";
import TempUIInstructor from "./Instructor/TempUIInstructor/TempUIInstructor";
import ScheduleTeaching from "./Instructor/Page/ScheduleTeaching/ScheduleTeaching";
import HomeInstructor from "./Instructor/Page/HomeInstructor/HomeInstructor";
import CourseDetailManager from "./Manager/Page/CourseDetailManager/CourseDetailManager";
import CourseViewAgencyManager from "./AgencyManager/Page/CourseViewAgencyManager/CourseViewAgencyManager";
import CourseDetailAgencyManager from "./AgencyManager/Page/CourseViewAgencyManager/CourseDetailAgencyManager";
import { LoadingProvider, useLoading } from "./Utils/LoadingContext";
import { Spin } from "antd";
import { ConfigProvider } from 'antd';
import vi_VN from 'antd/es/locale/vi_VN';
import TempUISystemInstructor from "./SystemInstructor/TempUISystemInstructor/TempUISystemInstructor";
import HomeSystemInstructor from "./SystemInstructor/Page/HomeSystemInstructor/HomeSystemInstructor";
import CourseSystemInstructor from "./SystemInstructor/Page/CourseSystemInstructor/CourseSystemInstructor";
import CourseDetailSystemInstructor from "./SystemInstructor/Page/CourseDetailSystemInstructor/CourseDetailSystemInstructor";
import QuizTest from "./Student/Page/QuizTest/QuizTest";
import QuizDescription from "./Student/Page/QuizDescription/QuizDescription";
import AttendancePage from "./Instructor/Page/AttendancePage/AttendancePage";
import AgencyDashboardPage from "./AgencyManager/Page/AgencyDashboard/AgencyDashboardpage";
import ClassDetailInstructor from "./Instructor/Page/ClassDetailInstructor/ClassDetailInstructor";
import QuizOfClass from "./Instructor/Page/QuizOfClass.jsx/QuizOfClass";
import AssignmentOfClass from "./Instructor/Page/AssignmentOfClass/AssignmentOfClass";
import ViewQuestionChapterManager from "./Manager/Page/ViewQuestionChapterManager/ViewQuestionChapterManager";
import ViewQuestionChapterSystemInstructor from "./SystemInstructor/Page/ViewQuestionChapterSystemInstructor/ViewQuestionChapterSystemInstructor";
import CourseDetailOfClass from "./Instructor/Page/CourseDetailOfClass.jsx/CourseDetailOfClass";
import DocumentManagement from "./Manager/Page/DocumentManagement/DocumentManagement";
import AgencyManagement from "./Manager/Page/AgencyManagement/AgencyManagement";
import AgencyDetail from "./Manager/Page/AgencyDetail/AgencyDetail";
import HomeSystemTechnician from "./SystemTechnician/Page/HomeSystemTechnician/HomeSystemTechnician";
import TemUISystemTechnician from "./SystemTechnician/TempUI/TemUISystemTechnician";
import ListTaskSystemTechnician from "./SystemTechnician/Page/ListTask/ListTaskSystemTechnician";
import ListTaskSystemInstructor from "./SystemInstructor/Page/ListTask/ListTaskSystemInstructor";
import TempUISystemConsultant from "./SystemConsultant/TempUI/TempUISystemConsultant";
import HomeSystemConsultant from "./SystemConsultant/Page/Home/HomeSystemConsultant";
import ListTaskSystemConsultant from "./SystemConsultant/Page/ListTask/ListTaskSystemConsultant";
import ConsultationManagement from "./SystemConsultant/Page/ConsultationManagement/ConsultationManagement";
import CreateContractPage from "./Manager/Page/ManageContract/CreateContractPage";
import ManageContractPage from "./Manager/Page/ManageContract/ManageContractPage";
import ManageContractAdminPage from "./Admin/Page/ManageContract/ManageContractAdminPage";
import SystemTechnicianAppointment from "./SystemTechnician/Page/ScheduleSystemTechnician/SystemTechnicianAppointment";
import SystemTechnicianAppointmentDetail from "./SystemTechnician/Page/ScheduleSystemTechnician/SystemTechnicianAppointmentDetail";
import ManagerAppointment from "./Manager/Page/ScheduleManager/ManagerAppointment";
import ManagerAppointmentDetail from "./Manager/Page/ScheduleManager/ManagerAppointmentDetail";
import SystemInstructorAppointment from "./SystemInstructor/Page/ScheduleSystemInstructor/SystemInstructorAppointment";
import SystemInstructorAppointmentDetail from "./SystemInstructor/Page/ScheduleSystemInstructor/SystemInstructorAppointmentDetail";
import SystemConsultantAppointment from "./SystemConsultant/Page/ScheduleSystemConsultant/SystemConsultantAppointment";
import SystemConsultantAppointmentDetail from "./SystemConsultant/Page/ScheduleSystemConsultant/SystemConsultantAppointmentDetail";
import ListTaskManager from "./Manager/Page/ListTask/ListTaskManager";
import AgencyManagerAppointment from "./AgencyManager/Page/ScheduleAgencyManager/AgencyManagerAppointment";
import AgencyManagerAppointmentDetail from "./AgencyManager/Page/ScheduleAgencyManager/AgencyManagerAppointmentDetail";
import AgencyActiveManagement from "./Manager/Page/AgencyActiveManagement/AgencyActiveManagement";
import ViewAssignment from "./Student/Page/ViewAssignment/ViewAssignment";
import AssignmentDetail from "./Student/Page/AssignmentDetail/AssignmentDetail";
import EquipmentManagementPage from './Manager/Page/EquipmentManagement/EquipmentManagementPage';
import AgencyAccountManagement from "./AgencyManager/Page/AgencyAccountManagement/AgencyAccountManagement";
import AccountManagement from "./Admin/Page/AccountManagement/AccountManagement";
import AgencyActiveDetailTask from "./Manager/Page/AgencyActiveDetailTask/AgencyActiveDetailTask";
import AgencyActiveInfo from "./Manager/Page/AgencyActiveInfo/AgencyActiveInfo";
import AgencyProgressFranchise from "./AgencyManager/Page/AgencyProgressFranchise/AgencyProgressFranchise";
import ListTaskAgencyManager from "./AgencyManager/Page/ListTaskAgencyManager.jsx/ListTaskAgencyManager";
import WorkTemplate from "./Admin/Page/WorkTemplate/WorkTemplate";
import PaymentSuccess from "./AgencyManager/Page/PaymentSuccess.jsx/PaymentSuccess";
import HomePageManagement from "./Admin/Page/HomePageManagement/HomePageManagement";
import EquipmentList from "./AgencyManager/Page/EquipmentList/EquipmentList";
import DocumentManagementAdmin from "./Admin/Page/DocumentManagementAdmin/DocumentManagementAdmin";
import ViewContractAgencyManager from "./AgencyManager/Page/ViewContractAgencyManager/ViewContractAgencyManager";
import ViewDocumentAgencyManager from "./AgencyManager/Page/ViewDocumentAgencyManager/ViewDocumentAgencyManager";
import TempUIAgencyStaff from "./AgencyStaff/TempUIAgencyStaff/TempUIAgencyStaff";
import StudentPaymentManagementAgencyStaff from "./AgencyStaff/Page/StudentPaymentManagement/StudentPaymentManagementAgencyStaff";
import SlotManagerAgencyStaff from "./AgencyStaff/Page/Slot/SlotManagerAgencyStaff";
import ClassManagementAgencyStaff from "./AgencyStaff/Page/ClassManagement/ClassManagementAgencyStaff";
import ClassDetailAgencyStaff from "./AgencyStaff/Page/ClassManagement/ClassDetailAgencyStaff";
import AgencyStaffAppointment from "./AgencyStaff/Page/ScheduleAgencyStaff/AgencyStaffAppointment";
import AgencyStaffAppointmentDetail from "./AgencyStaff/Page/ScheduleAgencyStaff/AgencyStaffAppointmentDetail";
import CourseViewAgencyStaff from "./AgencyStaff/Page/CourseViewAgencyStaff/CourseViewAgencyStaff";
import CourseDetailAgencyStaff from "./AgencyStaff/Page/CourseViewAgencyStaff/CourseDetailAgencyStaff";
import EquipmentListAgencyStaff from "./AgencyStaff/Page/EquipmentList/EquipmentListAgencyStaff";
import ReportList from "./AgencyManager/Page/ReportList/ReportList";
import ListReport from "./Manager/Page/ListReport/ListReport";
import PaymentManagement from "./Manager/Page/PaymentManagement/PaymentManagement";
import AgencyActiveAdminManagement from "./Admin/Page/AgencyActiveAdminManagement/AgencyActiveAdminManagement";
import AgencyActiveInfoAdmin from "./Admin/Page/AgencyActiveInfoAdmin/AgencyActiveInfoAdmin";
import AgencyEdit from "./Manager/Page/AgencyEdit/AgencyEdit";

const LoadingOverlay = () => {
  const { loading } = useLoading();
  return loading ? (
    <div className="loading-overlay">
      <Spin size="large" />
    </div>
  ) : null;
};

function App() {
  const { statusAgency } = useSelector((state) => state.AuthenticationReducer);

  return (
    <ConfigProvider locale={vi_VN}>
      <BrowserRouter>
        <LoadingProvider>
          <LoadingOverlay />
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
                <Route path="franchise" element={<FranchiseManagement />} />
                <Route path="course-category" element={<CourseCategoryAdmin />} />
                <Route path="course" element={<CourseManageAdmin />} />
                <Route path="profile" element={<Profile />} />
                <Route path="contracts" element={<ManageContractAdminPage />} />
                <Route path="system-accounts" element={<AccountManagement />} />
                <Route path="work-template" element={<WorkTemplate />} />
                <Route path="" element={<HomePageManagement />} />
                <Route path="documents" element={<DocumentManagementAdmin />} />
                <Route path="agency-active" element={<AgencyActiveAdminManagement />} />
                <Route path="agency-active/:id" element={<AgencyActiveInfoAdmin />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute requiredRole="AgencyManager" />}>
              <Route path="agency-manager" element={<TempUIAgencyManager />} >
                <Route path="student-consultation-registration" element={<StudentConsultationRegistration />} />
                <Route path="student-payment" element={<StudentPaymentManagement />} />
                <Route path="slots" element={<SlotManager />} />
                <Route path="classes" element={<ClassManagement />} />
                <Route path="classes/:id" element={<ClassDetail />} />
                <Route path="schedules" element={<ScheduleAgencyManager />} />
                <Route path="list-task" element={<ListTaskAgencyManager />} />
                <Route path="" element={statusAgency === "active" ? (<AgencyDashboardPage />) : (<ListTaskAgencyManager />)} />
                <Route path="appointment-schedule" element={<AgencyManagerAppointment />} />
                <Route path="appointment-schedule/details" element={<AgencyManagerAppointmentDetail />} />
                <Route path="course" element={<CourseViewAgencyManager />} />
                <Route path="course-detail/:id" element={<CourseDetailAgencyManager />} />
                <Route path="accounts" element={<AgencyAccountManagement />} />
                <Route path="profile" element={<Profile />} />
                <Route path="payment-success" element={<PaymentSuccess />} />
                <Route path="equipments" element={<EquipmentList />} />
                <Route path="reports" element={<ReportList />} />
                <Route path="contracts" element={<ViewContractAgencyManager />} />
                <Route path="documents" element={<ViewDocumentAgencyManager />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute requiredRole="Student" />}>
              <Route path="student" element={<TempUIStudent />}>
                <Route path="class/:id" element={<ClassDetailStudent />} />
                <Route path="class/:id/assignment" element={<ViewAssignment />} />
                <Route path="quiz" element={<QuizTest />} />
                <Route path="assignment/:assignmentId" element={<AssignmentDetail />} />
                <Route path="quiz/:quizId" element={<QuizDescription />} />
                <Route path="quiz/:quizId/start" element={<QuizTest />} />
                <Route path="" element={<ScheduleStudent />} />
                <Route path="change-password" element={<ChangePassword />} />
                <Route path="profile" element={<Profile />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute requiredRole="Instructor" />}>
              <Route path="instructor" element={<TempUIInstructor />}>
                <Route path="class/:id" element={<ClassDetailInstructor />} />
                <Route path="class/:id/course-detail" element={<CourseDetailOfClass />} />
                <Route path="class/:id/quiz" element={<QuizOfClass />} />
                <Route path="class/:id/assignment" element={<AssignmentOfClass />} />
                {/* <Route path="" element={<HomeInstructor />} /> */}
                {/* <Route path="schedule" element={<ScheduleTeaching />} /> */}
                <Route path="" element={<ScheduleInstructor />} />
                <Route path="schedules/attendances" element={<AttendancePage />} />
                <Route path="profile" element={<Profile />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute requiredRole="Manager" />}>
              <Route path="manager" element={<TempUIManager />}>
                <Route path="course-category" element={<CourseCategoryManager />} />
                <Route path="" element={<CourseManage />} />
                <Route path="course-detail/:id" element={<CourseDetailManager />} />
                <Route path="course-detail/:id/questions" element={<ViewQuestionChapterManager />} />
                <Route path="slot" element={<SlotManager />} />
                <Route path="documents" element={<DocumentManagement />} />
                <Route path="agency/:id/task-detail" element={<AgencyDetail />} />
                <Route path="agency-active/:id" element={<AgencyActiveInfo />} />
                <Route path="agency-active/:id/task-detail" element={<AgencyActiveDetailTask />} />
                <Route path="agency" element={<AgencyManagement />} />
                <Route path="agency/edit/:id" element={<AgencyEdit />} />
                <Route path="agency-active" element={<AgencyActiveManagement />} />
                <Route path="contracts" element={<ManageContractPage />} />
                <Route path="contract/create" element={<CreateContractPage />} />
                <Route path="appointment-schedule" element={<ManagerAppointment />} />
                <Route path="appointment-schedule/details" element={<ManagerAppointmentDetail />} />
                <Route path="list-task" element={<ListTaskManager />} />
                <Route path="agency-active/:id/equipments" element={<EquipmentManagementPage />} />
                <Route path="profile" element={<Profile />} />
                <Route path="report" element={<ListReport />} />
                <Route path="payments" element={<PaymentManagement />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute requiredRole="SystemInstructor" />}>
              <Route path="system-instructor" element={<TempUISystemInstructor />}>
                <Route path="" element={<CourseSystemInstructor />} />
                <Route path="course-detail/:id" element={<CourseDetailSystemInstructor />} />
                <Route path="course-detail/:id/questions" element={<ViewQuestionChapterSystemInstructor />} />
                <Route path="list-task" element={<ListTaskSystemInstructor />} />
                <Route path="appointment-schedule" element={<SystemInstructorAppointment />} />
                <Route path="appointment-schedule/details" element={<SystemInstructorAppointmentDetail />} />
                <Route path="profile" element={<Profile />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute requiredRole="SystemTechnician" />}>
              <Route path="system-technician" element={<TemUISystemTechnician />}>
                <Route path="" element={<ListTaskSystemTechnician />} />
                <Route path="appointment-schedule" element={<SystemTechnicianAppointment />} />
                <Route path="appointment-schedule/details" element={<SystemTechnicianAppointmentDetail />} />
                <Route path="profile" element={<Profile />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute requiredRole="SystemConsultant" />}>
              <Route path="system-consultant" element={<TempUISystemConsultant />}>
                <Route path="list-task" element={<ListTaskSystemConsultant />} />
                <Route path="appointment-schedule" element={<SystemConsultantAppointment />} />
                <Route path="appointment-schedule/details" element={<SystemConsultantAppointmentDetail />} />
                <Route path="" element={<ConsultationManagement />} />
                <Route path="profile" element={<Profile />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute requiredRole="AgencyStaff" />}>
              <Route path="agency-staff" element={<TempUIAgencyStaff />} >
                <Route path="" element={<StudentConsultationRegistration />} />
                <Route path="student-payment" element={<StudentPaymentManagementAgencyStaff />} />
                <Route path="slots" element={<SlotManagerAgencyStaff />} />
                <Route path="classes" element={<ClassManagementAgencyStaff />} />
                <Route path="classes/:id" element={<ClassDetailAgencyStaff />} />
                <Route path="schedules" element={<ScheduleAgencyManager />} />
                <Route path="appointment-schedule" element={<AgencyStaffAppointment />} />
                <Route path="appointment-schedule/details" element={<AgencyStaffAppointmentDetail />} />
                <Route path="course" element={<CourseViewAgencyStaff />} />
                <Route path="course-detail/:id" element={<CourseDetailAgencyStaff />} />
                <Route path="profile" element={<Profile />} />
                <Route path="equipments" element={<EquipmentListAgencyStaff />} />
              </Route>
            </Route>

            {/*Test page */}
            <Route path="student-page" element={<TempUIStudent />}>
              <Route path="" element={<HomeStudent />} />
              <Route path="course-detail" element={<ClassDetailStudent />} />
            </Route>
          </Routes>
        </LoadingProvider >
      </BrowserRouter >
    </ConfigProvider >
  );
}

export default App;
