import { CYBER_TOKEN } from "../config";

const BASE_URL = "https://movienew.cybersoft.edu.vn/api";

export async function getUserTickets() {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(
    "https://movienew.cybersoft.edu.vn/api/QuanLyNguoiDung/ThongTinTaiKhoan",
    {
      method: "POST",
      headers: {
        TokenCybersoft: CYBER_TOKEN,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return res.json();
}

export async function cancelTicket(maVe) {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${BASE_URL}/QuanLyDatVe/HuyVe?MaVe=${maVe}`, {
    method: "DELETE",
    headers: {
      TokenCybersoft: CYBER_TOKEN,
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}
