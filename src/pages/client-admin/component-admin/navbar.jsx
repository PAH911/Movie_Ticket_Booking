import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../store/slices/authSlice";
import { UserOutlined } from "@ant-design/icons";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/admin/auth", { replace: true });
  };

  return (
    <nav className="bg-white shadow-lg rounded-b-2xl px-8 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-extrabold text-[#1677ff] tracking-wide drop-shadow-lg">
          CineGo
        </span>
      </div>
      <div className="flex items-center gap-6">
        {user && (
          <div className="flex items-center gap-3 bg-[#f5f7fa] px-4 py-2 rounded-xl shadow-sm">
            <UserOutlined className="text-[#1677ff] text-xl" />
            <span className="font-semibold text-[#222]">{user.hoTen}</span>
            <button
              onClick={handleLogout}
              className="ml-4 bg-gradient-to-r from-[#fd9125] to-[#ffe066] text-white font-bold px-5 py-2 rounded-lg shadow hover:from-[#ffe066] hover:to-[#fd9125] hover:text-[#1677ff] transition-all duration-200"
            >
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
