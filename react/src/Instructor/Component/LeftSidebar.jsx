import React from "react";
import { NavLink } from "react-router-dom";

// Dữ liệu cho sidebar
const sidebarItems = [
  { type: 'section', label: 'Trang chủ', icon: 'ti ti-dots' },
  { type: 'link', label: 'Bảng điều khiển', path: '/instructor', icon: 'solar:home-smile-bold-duotone' },
  { type: 'section', label: 'Quản lý', icon: 'ti ti-dots' },
  { type: 'link', label: 'Người dùng', path: '#', icon: 'solar:layers-minimalistic-bold-duotone' },
  { type: 'link', label: 'Giảng viên', path: '#', icon: 'solar:danger-circle-bold-duotone' },
  { type: 'link', label: 'Khóa học', path: '#', icon: 'solar:bookmark-square-minimalistic-bold-duotone' },
  { type: 'link', label: 'Lịch học', path: '#', icon: 'solar:file-text-bold-duotone' },
  { type: 'link', label: 'Kiểu chữ', path: '#', icon: 'solar:text-field-focus-bold-duotone' },
  { type: 'section', label: 'Tư vấn' },
  { type: 'link', label: 'Phê duyệt', path: '#', icon: 'solar:login-3-bold-duotone' },
  { type: 'link', label: 'Trạng thái', path: '#', icon: 'solar:user-plus-rounded-bold-duotone' },
];

const LeftSidebar = ({ onSidebarToggle }) => {
  return (
    <aside className="left-sidebar">
      <div>
        <div className="brand-logo d-flex align-items-center justify-content-between">
          <NavLink to="/instructor" className="text-nowrap logo-img">
            <img src="/assets/images/logos/logo-light.svg" alt="logo" />
          </NavLink>
          <div
            className="close-btn d-xl-none d-block sidebartoggler cursor-pointer"
            id="sidebarCollapse"
            onClick={onSidebarToggle}
          >
            <i className="ti ti-x fs-8" />
          </div>
        </div>
        {/* Sidebar navigation*/}
        <nav className="sidebar-nav scroll-sidebar" data-simplebar>
          <ul id="sidebarnav">
            <li className="nav-small-cap">
              <i className="ti ti-dots nav-small-cap-icon fs-6" />
              <span className="hide-menu"></span>
            </li>
            <li className="sidebar-item">
              <NavLink
                className="sidebar-link"
                to="schedules"
                aria-expanded="false"
                activeClassName="active"
              >
                <span>
                  <iconify-icon
                    icon="uis:schedule"
                    className="fs-6"
                  />
                </span>
                <span className="hide-menu">Lịch học</span>
              </NavLink>
            </li>
          </ul>
        </nav>
        {/* End Sidebar navigation */}
      </div>
      {/* End Sidebar scroll*/}
    </aside>
  )
}

export default LeftSidebar
