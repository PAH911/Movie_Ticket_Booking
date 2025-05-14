import axios from "axios";
import { CYBER_TOKEN } from "../config";

const BASE_URL = "https://movienew.cybersoft.edu.vn/api";

export const loginService = (user) => {
  return axios({
    method: "POST",
    url: "https://movienew.cybersoft.edu.vn/api/QuanLyNguoiDung/DangNhap",
    data: user,
    headers: {
      TokenCybersoft: CYBER_TOKEN,
    },
  });
};

export async function getUserList(keyword = "") {
  const token = localStorage.getItem("accessToken");
  const url = keyword
    ? `${BASE_URL}/QuanLyNguoiDung/TimKiemNguoiDung?tuKhoa=${keyword}`
    : `${BASE_URL}/QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=GP01`;
  const res = await fetch(url, {
    headers: {
      TokenCybersoft: CYBER_TOKEN,
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

export async function getUserTypes() {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(
    `${BASE_URL}/QuanLyNguoiDung/LayDanhSachLoaiNguoiDung`,
    {
      headers: {
        TokenCybersoft: CYBER_TOKEN,
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.json();
}

export async function addUser(data) {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${BASE_URL}/QuanLyNguoiDung/ThemNguoiDung`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      TokenCybersoft: CYBER_TOKEN,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateUser(data) {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(
    `${BASE_URL}/QuanLyNguoiDung/CapNhatThongTinNguoiDung`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        TokenCybersoft: CYBER_TOKEN,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );
  return res.json();
}

export async function deleteUser(taiKhoan) {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(
    `${BASE_URL}/QuanLyNguoiDung/XoaNguoiDung?TaiKhoan=${taiKhoan}`,
    {
      method: "DELETE",
      headers: {
        TokenCybersoft: CYBER_TOKEN,
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.json();
}
