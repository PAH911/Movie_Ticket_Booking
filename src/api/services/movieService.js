// https://movienew.cybersoft.edu.vn/api/QuanLyPhim/LayDanhSachPhim?maNhom=GP07

import axios from "axios";
import { CYBER_TOKEN } from "../config";

const BASE_URL = "https://movienew.cybersoft.edu.vn/api";

export const movieService = {
  getMovieList: (params = { maNhom: "GP01" }) =>
    axios.get(`${BASE_URL}/QuanLyPhim/LayDanhSachPhim`, {
      params,
      headers: { TokenCybersoft: CYBER_TOKEN },
    }),

  searchMovies: ({ tenPhim = "", theLoai = "", dienVien = "" }) =>
    axios.get(`${BASE_URL}/QuanLyPhim/TimKiemPhim`, {
      params: { tenPhim, theLoai, dienVien },
      headers: { TokenCybersoft: CYBER_TOKEN },
    }),

  getMovieDetail: (movieId) =>
    axios.get(`${BASE_URL}/QuanLyPhim/LayThongTinPhim`, {
      params: { MaPhim: movieId },
      headers: { TokenCybersoft: CYBER_TOKEN },
    }),

  getMovieShowtimes: (movieId) =>
    axios.get(`${BASE_URL}/QuanLyRap/LayThongTinLichChieuPhim`, {
      params: { MaPhim: movieId },
      headers: { TokenCybersoft: CYBER_TOKEN },
    }),

  addMovie: (formData) =>
    axios.post(`${BASE_URL}/QuanLyPhim/ThemPhimUploadHinh`, formData, {
      headers: { TokenCybersoft: CYBER_TOKEN },
    }),

  updateMovie: (formData) => {
    const token = localStorage.getItem("accessToken");
    return axios.post(`${BASE_URL}/QuanLyPhim/CapNhatPhimUpload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        TokenCybersoft: CYBER_TOKEN,
      },
    });
  },

  deleteMovie: (maPhim) => {
    const token = localStorage.getItem("accessToken");
    return axios.delete(`${BASE_URL}/QuanLyPhim/XoaPhim?MaPhim=${maPhim}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        TokenCybersoft: CYBER_TOKEN,
      },
    });
  },
};
