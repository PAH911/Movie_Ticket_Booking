import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  getTheaterSystems,
  getTheaterClusters,
  getShowtimesBySystem,
  getSeatList,
} from "../../../api/services/cinemaApi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function BookingPage() {
  const { t } = useTranslation();
  const [theaterSystems, setTheaterSystems] = useState([]);
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [clusters, setClusters] = useState([]);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [showtimes, setShowtimes] = useState([]); // Lịch chiếu toàn hệ thống
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showSeatCard, setShowSeatCard] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatList, setSeatList] = useState([]);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getTheaterSystems().then((data) => setTheaterSystems(data.content || []));
    getShowtimesBySystem().then((data) => setShowtimes(data.content || []));
  }, []);

  // Khi chọn hệ thống rạp
  const handleSystemSelect = (system) => {
    setSelectedSystem(system);
    setSelectedCluster(null);
    setSelectedMovie(null);
    setSelectedShowtime(null);
    getTheaterClusters(system.maHeThongRap).then((data) =>
      setClusters(data.content || [])
    );
  };

  // Khi chọn cụm rạp
  const handleClusterSelect = (cluster) => {
    setSelectedCluster(cluster);
    setSelectedMovie(null);
    setSelectedShowtime(null);
    // Lấy phim đang chiếu tại cụm rạp này từ showtimes
    const systemShowtime = showtimes.find(
      (sys) => sys.maHeThongRap === selectedSystem.maHeThongRap
    );
    const clusterShowtime = systemShowtime?.lstCumRap.find(
      (c) => c.maCumRap === cluster.maCumRap
    );
    setMovies(clusterShowtime?.danhSachPhim || []);
  };

  // Khi chọn phim
  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    setSelectedShowtime(null);
  };

  // Khi chọn suất chiếu
  const handleShowtimeSelect = (showtime) => {
    setSelectedShowtime(showtime);
  };

  const handleBooking = async () => {
    if (!selectedShowtime || !selectedMovie || !selectedCluster) {
      setShowPopup(true);
      return;
    }
    setLoadingSeats(true);
    const data = await getSeatList(selectedShowtime.maLichChieu);
    let seats = data.content?.danhSachGhe || [];
    // Đồng bộ ghế đã đặt từ localStorage
    const tickets = JSON.parse(localStorage.getItem("myTickets") || "[]");
    const bookedSeats = tickets
      .filter((t) => t.maLichChieu === selectedShowtime.maLichChieu)
      .flatMap((t) => t.ghe.map((g) => g.maGhe));
    seats = seats.map((seat) =>
      bookedSeats.includes(seat.maGhe) ? { ...seat, daDat: true } : seat
    );
    setSeatList(seats);
    // Persist booking info to localStorage
    localStorage.setItem(
      "bookingInfo",
      JSON.stringify({
        selectedShowtime,
        selectedMovie,
        selectedCluster,
      })
    );
    setShowSeatCard(true);
    setLoadingSeats(false);
  };

  const handleSeatSelect = (seat) => {
    if (seat.daDat) return;
    setSelectedSeats((prev) =>
      prev.some((s) => s.maGhe === seat.maGhe)
        ? prev.filter((s) => s.maGhe !== seat.maGhe)
        : [...prev, seat]
    );
  };

  const handleBackToBooking = () => {
    setShowSeatCard(false);
    setSelectedSeats([]);
    setSeatList([]);
  };

  const saveTicket = (ticket) => {
    // Thêm ngày đặt
    ticket.ngayDat = new Date().toISOString();
    // Lưu vé vào localStorage
    const tickets = JSON.parse(localStorage.getItem("myTickets") || "[]");
    tickets.push(ticket);
    localStorage.setItem("myTickets", JSON.stringify(tickets));
    // Cập nhật trạng thái ghế trong localStorage
    const seatStates = JSON.parse(localStorage.getItem("seatStates") || "{}");
    seatStates[ticket.maLichChieu] = [
      ...(seatStates[ticket.maLichChieu] || []),
      ...ticket.ghe,
    ];
    localStorage.setItem("seatStates", JSON.stringify(seatStates));
  };

  const handlePayment = () => {
    let showtime = selectedShowtime;
    let movie = selectedMovie;
    let cluster = selectedCluster;
    if (!showtime || !movie || !cluster) {
      // Try to restore from localStorage
      const bookingInfo = JSON.parse(
        localStorage.getItem("bookingInfo") || "{}"
      );
      if (
        bookingInfo.selectedShowtime &&
        bookingInfo.selectedMovie &&
        bookingInfo.selectedCluster
      ) {
        showtime = bookingInfo.selectedShowtime;
        movie = bookingInfo.selectedMovie;
        cluster = bookingInfo.selectedCluster;
      } else {
        alert("Thiếu thông tin đặt vé, vui lòng chọn lại!");
        setShowSeatCard(false);
        return;
      }
    }
    setPaymentSuccess(true);
    // Lưu vé vào localStorage
    saveTicket({
      maLichChieu: showtime.maLichChieu,
      tenPhim: movie.tenPhim,
      tenRap: cluster.tenCumRap,
      thoiGian: showtime.ngayChieuGioChieu,
      ghe: selectedSeats.map((g) => ({ maGhe: g.maGhe, tenGhe: g.tenGhe })),
      tongTien: selectedSeats.reduce((sum, seat) => sum + seat.giaVe, 0),
      hinhAnh: movie.hinhAnh,
    });
    setSeatList((prev) =>
      prev.map((seat) =>
        selectedSeats.some((s) => s.maGhe === seat.maGhe)
          ? { ...seat, daDat: true }
          : seat
      )
    );
    setSelectedSeats([]);
    // Remove bookingInfo from localStorage after payment
    localStorage.removeItem("bookingInfo");
    setTimeout(() => {
      setPaymentSuccess(false);
      setShowSeatCard(false);
      setSeatList([]);
      navigate("/myticket");
    }, 2000);
  };

  // Group showtimes by date for selected movie
  const showtimesByDate = {};
  if (selectedMovie && selectedMovie.lstLichChieuTheoPhim) {
    selectedMovie.lstLichChieuTheoPhim.forEach((showtime) => {
      const date = new Date(showtime.ngayChieuGioChieu).toLocaleDateString(
        "vi-VN"
      );
      if (!showtimesByDate[date]) showtimesByDate[date] = [];
      showtimesByDate[date].push(showtime);
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fffbe6] to-[#ffe066] py-10 px-2 md:px-0">
      <button
        onClick={() => navigate("/")}
        className="mb-6 ml-6 px-6 py-2 rounded-xl bg-gradient-to-r from-[#ffe066] to-[#fd9125] text-white font-bold shadow hover:from-[#fd9125] hover:to-[#ffe066] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#fd9125]"
      >
        {t("common.backToHome")}
      </button>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
        className="max-w-7xl mx-auto bg-white rounded-[2.5rem] shadow-2xl p-10 md:p-16 border-4 border-[#ffe066]"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#fd9125] text-center mb-10 tracking-tight drop-shadow-lg">
          {t("movie.bookTicket")}
        </h1>
        {/* Card chọn rạp/phim/suất chiếu */}
        {!showSeatCard && (
          <div className="flex flex-col md:flex-row gap-8 justify-evenly items-start">
            {/* 1. Hệ thống rạp */}
            <div className="flex-1 min-w-[180px] max-w-[220px] max-h-[420px] overflow-y-auto">
              <h2 className="text-xl font-bold text-[#ff9a3b] mb-4">
                1. {t("movie.theaterSystem")}
              </h2>
              <div className="space-y-4 max-h-[500px] pr-2">
                {theaterSystems.map((sys) => (
                  <motion.div
                    key={sys.maHeThongRap}
                    whileHover={{ scale: 1.03 }}
                    className={`cursor-pointer flex items-center gap-3 rounded-xl border-2 p-4 transition-all duration-200 bg-gradient-to-br from-[#fffbe6] to-[#ffe066] shadow-sm ${
                      selectedSystem?.maHeThongRap === sys.maHeThongRap
                        ? "border-[#fd9125] ring-2 ring-[#fd9125] bg-[#fff3cd]"
                        : "border-transparent"
                    }`}
                    onClick={() => handleSystemSelect(sys)}
                  >
                    <img
                      src={sys.logo}
                      alt={sys.tenHeThongRap}
                      className="h-10 w-10 object-contain"
                    />
                    <span className="font-semibold text-[#222]">
                      {sys.tenHeThongRap}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
            {/* 2. Cụm rạp */}
            <div className="flex-1 min-w-[220px] max-w-[260px] max-h-[420px] overflow-y-auto">
              <h2 className="text-xl font-bold text-[#ff9a3b] mb-4">
                2. {t("movie.theaterCluster")}
              </h2>
              <div className="space-y-4 max-h-[500px] pr-2">
                {clusters.map((cluster) => (
                  <motion.div
                    key={cluster.maCumRap}
                    whileHover={{ scale: 1.03 }}
                    className={`cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 bg-gradient-to-br from-[#fffbe6] to-[#ffe066] shadow-sm ${
                      selectedCluster?.maCumRap === cluster.maCumRap
                        ? "border-[#fd9125] ring-2 ring-[#fd9125] bg-[#fff3cd]"
                        : "border-transparent"
                    }`}
                    onClick={() => handleClusterSelect(cluster)}
                  >
                    <div className="font-semibold text-[#222]">
                      {cluster.tenCumRap}
                    </div>
                    <div className="text-xs text-[#ff9a3b] mt-1">
                      {cluster.diaChi}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            {/* 3. Chọn phim */}
            <div className="flex-1 min-w-[220px] max-w-[320px] max-h-[420px] overflow-y-auto">
              <h2 className="text-xl font-bold text-[#ff9a3b] mb-4">
                3. {t("movie.selectMovie")}
              </h2>
              <div className="space-y-4 max-h-[500px] pr-2">
                {movies.map((movie) => (
                  <motion.div
                    key={movie.maPhim}
                    whileHover={{ scale: 1.04 }}
                    className={`cursor-pointer flex gap-3 rounded-xl border-2 p-3 transition-all duration-200 shadow-sm bg-gradient-to-br from-[#fffbe6] to-[#ffe066] ${
                      selectedMovie?.maPhim === movie.maPhim
                        ? "border-[#fd9125] ring-2 ring-[#fd9125] bg-[#fff3cd]"
                        : "border-transparent"
                    }`}
                    onClick={() => handleMovieSelect(movie)}
                  >
                    <img
                      src={movie.hinhAnh}
                      alt={movie.tenPhim}
                      className="h-16 w-12 object-cover rounded"
                    />
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="font-semibold text-[#222] truncate">
                        {movie.tenPhim}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            {/* 4. Suất chiếu */}
            <div
              className="flex-1 min-w-[220px] max-w-[320px] flex flex-col"
              style={{ height: "420px" }}
            >
              <h2 className="text-xl font-bold text-[#ff9a3b] mb-4">
                4. {t("movie.showtime")}
              </h2>
              <div className="flex-1 overflow-y-auto pr-1">
                {selectedMovie ? (
                  Object.keys(showtimesByDate).length === 0 ? (
                    <div className="text-gray-400 italic">
                      {t("movie.noShowtime")}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(showtimesByDate).map(
                        ([date, showtimes]) => (
                          <div key={date} className="mb-2">
                            <div className="font-semibold text-[#fd9125] mb-1">
                              {date}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {showtimes.map((showtime) => (
                                <button
                                  key={showtime.maLichChieu}
                                  onClick={() => setSelectedShowtime(showtime)}
                                  className={`px-4 py-2 rounded-xl border-2 font-semibold shadow-sm transition-all duration-200 text-base
                                  ${
                                    selectedShowtime?.maLichChieu ===
                                    showtime.maLichChieu
                                      ? "bg-[#fd9125] text-white border-[#fd9125] scale-105 shadow-lg"
                                      : "bg-white text-[#fd9125] border-[#ffe066] hover:bg-[#ffe066]/60 hover:scale-105"
                                  }
                                `}
                                >
                                  {new Date(
                                    showtime.ngayChieuGioChieu
                                  ).toLocaleTimeString("vi-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </button>
                              ))}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )
                ) : (
                  <div className="text-gray-400 italic">
                    {t("movie.selectMovieFirst")}
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-end sticky bottom-0 bg-white pt-2 z-10">
                <button
                  onClick={handleBooking}
                  disabled={!selectedShowtime}
                  className="px-8 py-2 rounded-xl bg-gradient-to-r from-[#ffe066] to-[#fd9125] text-white font-bold shadow hover:from-[#fd9125] hover:to-[#ffe066] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#fd9125] disabled:opacity-60 text-lg"
                >
                  {t("movie.bookTicket")}
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Card chọn ghế */}
        {showSeatCard && (
          <motion.div
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 200, opacity: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="flex flex-col md:flex-row gap-8 mt-8"
          >
            {/* Lưới ghế */}
            <div className="flex-1 bg-[#fffbe6] rounded-2xl p-6 shadow-lg border-2 border-[#ffe066]">
              <h2 className="text-xl font-bold text-[#fd9125] mb-4">
                {t("movie.selectSeats")}
              </h2>
              <div className="overflow-x-auto">
                <div className="inline-block min-w-[400px]">
                  <div className="flex flex-col items-center">
                    <div className="mb-2 text-sm text-[#fd9125]">
                      {t("movie.screen")}
                    </div>
                    <div className="w-full h-2 bg-gradient-to-r from-[#ffe066] to-[#fd9125] rounded mb-4" />
                    {loadingSeats ? (
                      <div className="text-[#fd9125] font-semibold py-10">
                        {t("movie.loadingSeats")}
                      </div>
                    ) : seatList.length === 0 ? (
                      <div className="text-gray-400 py-10">
                        {t("movie.noSeats")}
                      </div>
                    ) : (
                      <div className="grid grid-cols-16 gap-1">
                        {seatList.map((seat, idx) => (
                          <button
                            key={seat.maGhe}
                            onClick={() => handleSeatSelect(seat)}
                            disabled={seat.daDat}
                            className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold border-2 transition-all duration-150
                              ${
                                seat.daDat
                                  ? "bg-gray-300 text-gray-400 border-gray-300 cursor-not-allowed"
                                  : selectedSeats.some(
                                      (s) => s.maGhe === seat.maGhe
                                    )
                                  ? "bg-[#fd9125] text-white border-[#fd9125]"
                                  : seat.loaiGhe === "Vip"
                                  ? "bg-[#fff3cd] text-[#fd9125] border-[#fd9125]"
                                  : "bg-white text-[#fd9125] border-[#ffe066] hover:bg-[#ffe066]"
                              }
                            `}
                            style={{ gridColumn: (idx % 16) + 1 }}
                          >
                            {seat.tenGhe}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* Legend */}
              <div className="flex gap-4 mt-4 text-xs">
                <div className="flex items-center gap-1">
                  <span className="w-5 h-5 rounded bg-gray-300 inline-block border-2 border-gray-300" />{" "}
                  {t("movie.sold")}
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-5 h-5 rounded bg-[#fd9125] inline-block border-2 border-[#fd9125]" />{" "}
                  {t("movie.selected")}
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-5 h-5 rounded bg-[#fff3cd] inline-block border-2 border-[#fd9125]" />{" "}
                  {t("movie.vipSeat")}
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-5 h-5 rounded bg-white inline-block border-2 border-[#ffe066]" />{" "}
                  {t("movie.regularSeat")}
                </div>
              </div>
            </div>
            {/* Thông tin phim/rạp/suất chiếu và thanh toán */}
            <div className="w-full md:w-[350px] bg-white rounded-2xl p-6 shadow-lg border-2 border-[#ffe066] flex flex-col justify-between">
              <div>
                <div className="flex gap-3 items-center mb-4">
                  <img
                    src={selectedMovie?.hinhAnh}
                    alt={selectedMovie?.tenPhim}
                    className="h-20 w-16 object-cover rounded"
                  />
                  <div>
                    <div className="font-bold text-[#fd9125] text-lg">
                      {selectedMovie?.tenPhim}
                    </div>
                    <div className="text-sm text-[#ff9a3b]">
                      {selectedCluster?.tenCumRap}
                    </div>
                    <div className="text-xs text-[#222]">
                      {t("movie.showtimeInfo")}
                      <span className="font-semibold">
                        {selectedShowtime &&
                          new Date(
                            selectedShowtime.ngayChieuGioChieu
                          ).toLocaleString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "2-digit",
                          })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="border-t border-dashed border-[#ffe066] my-4" />
                <div className="text-sm mb-2">{t("movie.selectedSeats")}:</div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedSeats.length === 0 ? (
                    <span className="text-gray-400">
                      {t("movie.notSelected")}
                    </span>
                  ) : (
                    selectedSeats.map((seat) => (
                      <span
                        key={seat.maGhe}
                        className="px-2 py-1 rounded bg-[#fd9125] text-white text-xs font-bold"
                      >
                        {seat.tenGhe}
                      </span>
                    ))
                  )}
                </div>
                <div className="text-lg font-bold text-[#fd9125] mb-2">
                  {t("movie.total")}:{" "}
                  {selectedSeats
                    .reduce((sum, seat) => sum + seat.giaVe, 0)
                    .toLocaleString()}{" "}
                  {t("movie.currency")}
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleBackToBooking}
                  className="flex-1 py-2 rounded-xl bg-white border-2 border-[#fd9125] text-[#fd9125] font-bold hover:bg-[#ffe066] transition"
                >
                  {t("movie.backToBooking")}
                </button>
                <button
                  disabled={selectedSeats.length === 0 || paymentSuccess}
                  onClick={handlePayment}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#ffe066] to-[#fd9125] text-white font-bold shadow hover:from-[#fd9125] hover:to-[#ffe066] transition disabled:opacity-60"
                >
                  {t("movie.pay")}
                </button>
              </div>
            </div>
          </motion.div>
        )}
        {/* Hiệu ứng thanh toán thành công */}
        {paymentSuccess && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40"
          >
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", duration: 0.7 }}
              className="bg-white rounded-3xl shadow-2xl p-10 border-4 border-[#fd9125] flex flex-col items-center relative overflow-hidden"
            >
              {/* Confetti animation */}
              <div className="absolute inset-0 pointer-events-none">
                <svg width="100%" height="100%">
                  <circle cx="30" cy="30" r="6" fill="#fd9125">
                    <animate
                      attributeName="cy"
                      values="30;120;30"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle cx="120" cy="50" r="5" fill="#ffe066">
                    <animate
                      attributeName="cy"
                      values="50;140;50"
                      dur="1.2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle cx="80" cy="20" r="4" fill="#ff9a3b">
                    <animate
                      attributeName="cy"
                      values="20;110;20"
                      dur="1.7s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </svg>
              </div>
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="flex flex-col items-center"
              >
                <svg width="80" height="80" fill="#fd9125" viewBox="0 0 24 24">
                  <path d="M20.285 6.709l-11.285 11.285-5.285-5.285 1.414-1.414 3.871 3.871 9.871-9.871z" />
                </svg>
                <div className="mt-4 text-3xl font-extrabold text-[#fd9125] drop-shadow-lg animate-bounce">
                  {t("movie.paymentSuccess")}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {showPopup && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40"
          >
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", duration: 0.7 }}
              className="bg-white rounded-3xl shadow-2xl p-10 border-4 border-[#fd9125] flex flex-col items-center relative overflow-hidden"
            >
              <div className="mt-4 text-3xl font-extrabold text-[#fd9125] drop-shadow-lg animate-bounce">
                {t("movie.selectAgain")}
              </div>
              <button
                onClick={() => setShowPopup(false)}
                className="mt-4 px-5 py-2 rounded-xl bg-gradient-to-r from-[#ffe066] to-[#fd9125] text-white font-bold shadow hover:from-[#fd9125] hover:to-[#ffe066] transition"
              >
                {t("movie.close")}
              </button>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
