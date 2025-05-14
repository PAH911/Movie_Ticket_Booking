import api from "./api";

export const authService = {
  // Đăng nhập
  login: (data) => {
    return api.post("/QuanLyNguoiDung/DangNhap", data);
  },

  // Đăng ký
  register: (data) => {
    return api.post("/QuanLyNguoiDung/DangKy", data);
  },

  // Lấy thông tin người dùng
  getUserInfo: () => {
    return api.post("/QuanLyNguoiDung/ThongTinTaiKhoan");
  },

  // Cập nhật thông tin người dùng
  updateUserInfo: (data) => {
    return api.put("/QuanLyNguoiDung/CapNhatThongTinNguoiDung", data);
  },

  // Đặt vé
  bookTicket: (data) => {
    return api.post("/QuanLyDatVe/DatVe", data);
  },

  // Lấy danh sách vé đã đặt
  getBookedTickets: () => {
    return api.post("/QuanLyNguoiDung/ThongTinDatVe");
  },
};
