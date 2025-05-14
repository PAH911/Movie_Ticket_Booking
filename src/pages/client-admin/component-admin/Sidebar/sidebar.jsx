import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  VideoCameraOutlined,
  CalendarOutlined,
  UserOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import logo from "../../../../assets/imgs/cine-logo.png";
const menu = [
  { to: "/admin", label: "Dashboard", icon: <DashboardOutlined /> },
  { to: "/admin/movie", label: "Quản lý phim", icon: <VideoCameraOutlined /> },
  { to: "/admin/showtime", label: "Quản lý vé", icon: <CalendarOutlined /> },
  { to: "/admin/user", label: "Quản lý người dùng", icon: <UserOutlined /> },
  { to: "/admin/report", label: "Báo cáo", icon: <BarChartOutlined /> },
];

export default function SideBar() {
  const location = useLocation();
  return (
    <aside
      className="fixed top-0 left-0 z-40 w-64 h-screen bg-gradient-to-b from-[#1677ff] via-[#fd9125] to-[#ffe066] shadow-xl flex flex-col"
      aria-label="Sidebar"
    >
      <div className="flex flex-col items-center py-8 mb-8">
        <img
          src={logo}
          alt="CineGo Logo"
          className="w-16 h-16 rounded-full shadow-lg mb-2 border-4 border-white"
        />
        <span className="text-2xl font-extrabold text-white tracking-wide drop-shadow-lg">
          CineGo
        </span>
      </div>
      <ul className="flex-1 space-y-2 px-4">
        {menu.map((item) => {
          const active = location.pathname.startsWith(item.to);
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-lg transition-all duration-200 shadow-sm
                  ${
                    active
                      ? "bg-white/90 text-[#1677ff] shadow-lg"
                      : "text-white hover:bg-white/20 hover:text-[#1677ff]"
                  }
                `}
                style={{
                  boxShadow: active
                    ? "0 2px 12px 0 rgba(22,119,255,0.08)"
                    : undefined,
                }}
              >
                <span className="text-xl">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-auto py-6 text-center text-xs text-white/70">
        © {new Date().getFullYear()} CineGo Admin
      </div>
    </aside>
  );
}
