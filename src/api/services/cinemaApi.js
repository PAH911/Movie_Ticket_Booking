import { CYBER_TOKEN } from "../config";

const BASE_URL = "https://movienew.cybersoft.edu.vn/api";

export async function getMovies(maNhom = "GP09") {
  const res = await fetch(
    `${BASE_URL}/QuanLyPhim/LayDanhSachPhim?maNhom=${maNhom}`,
    {
      headers: { TokenCybersoft: CYBER_TOKEN },
    }
  );
  return res.json();
}

export async function getTheaterSystems() {
  const res = await fetch(`${BASE_URL}/QuanLyRap/LayThongTinHeThongRap`, {
    headers: { TokenCybersoft: CYBER_TOKEN },
  });
  return res.json();
}

export async function getTheaterClusters(maHeThongRap) {
  const res = await fetch(
    `${BASE_URL}/QuanLyRap/LayThongTinCumRapTheoHeThong?maHeThongRap=${maHeThongRap}`,
    {
      headers: { TokenCybersoft: CYBER_TOKEN },
    }
  );
  return res.json();
}

export async function getShowtimesBySystem(maNhom = "GP09") {
  const res = await fetch(
    `${BASE_URL}/QuanLyRap/LayThongTinLichChieuHeThongRap?maNhom=${maNhom}`,
    {
      headers: { TokenCybersoft: CYBER_TOKEN },
    }
  );
  return res.json();
}

export async function getShowtimesByMovie(maPhim) {
  const res = await fetch(
    `${BASE_URL}/QuanLyRap/LayThongTinLichChieuPhim?MaPhim=${maPhim}`,
    {
      headers: { TokenCybersoft: CYBER_TOKEN },
    }
  );
  return res.json();
}

export async function getSeatList(maLichChieu) {
  const res = await fetch(
    `${BASE_URL}/QuanLyDatVe/LayDanhSachPhongVe?MaLichChieu=${maLichChieu}`,
    {
      headers: { TokenCybersoft: CYBER_TOKEN },
    }
  );
  return res.json();
}

export async function createShowtime(payload) {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${BASE_URL}/QuanLyDatVe/TaoLichChieu`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      TokenCybersoft: CYBER_TOKEN,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return res.json();
}
