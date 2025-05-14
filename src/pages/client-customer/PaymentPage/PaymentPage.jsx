import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getSeatList } from "../../../api/services/cinemaApi";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedMovie, selectedSystem, selectedCluster, selectedShowtime } =
    location.state || {};
  const { t } = useTranslation();

  const [seatList, setSeatList] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (!selectedShowtime) return;
    setLoadingSeats(true);
    getSeatList(selectedShowtime.maLichChieu).then((data) => {
      let seats = data.content?.danhSachGhe || [];

      // Lấy trạng thái ghế từ localStorage
      const seatStates = JSON.parse(localStorage.getItem("seatStates") || "{}");
      const bookedSeats = seatStates[selectedShowtime.maLichChieu] || [];

      // Cập nhật trạng thái ghế đã đặt
      seats = seats.map((seat) =>
        bookedSeats.some((s) => s.maGhe === seat.maGhe)
          ? { ...seat, daDat: true }
          : seat
      );

      setSeatList(seats);
      setLoadingSeats(false);
    });
  }, [selectedShowtime]);

  const handleSeatSelect = (seat) => {
    if (seat.daDat) return;
    setSelectedSeats((prev) =>
      prev.some((s) => s.maGhe === seat.maGhe)
        ? prev.filter((s) => s.maGhe !== seat.maGhe)
        : [...prev, seat]
    );
  };

  const saveTicket = (ticket) => {
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
    if (!selectedShowtime || !selectedMovie || !selectedCluster) {
      toast.error(t("payment.paymentFailed"));
      return;
    }
    if (selectedSeats.length === 0) {
      toast.warning(t("movie.notSelected"));
      return;
    }
    setPaymentSuccess(true);

    // Tạo thông tin vé
    const ticket = {
      maLichChieu: selectedShowtime.maLichChieu,
      tenPhim: selectedMovie.tenPhim,
      tenRap: selectedCluster.tenCumRap,
      thoiGian: selectedShowtime.ngayChieuGioChieu,
      ghe: selectedSeats.map((g) => ({ maGhe: g.maGhe, tenGhe: g.tenGhe })),
      tongTien: selectedSeats.reduce((sum, seat) => sum + seat.giaVe, 0),
      hinhAnh: selectedMovie.hinhAnh,
      ngayDat: new Date().toISOString(),
    };

    // Lưu vé và cập nhật trạng thái ghế
    saveTicket(ticket);

    // Hiển thị thông báo thành công
    toast.success(t("payment.paymentSuccess"));

    // Chuyển hướng sau 2 giây
    setTimeout(() => {
      setPaymentSuccess(false);
      navigate("/myticket");
    }, 2000);
  };

  if (!selectedShowtime || !selectedMovie || !selectedCluster) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-2xl text-red-500 mb-4">
          {t("payment.paymentFailed")}
        </div>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#ffe066] to-[#fd9125] text-white font-bold shadow hover:from-[#fd9125] hover:to-[#ffe066] transition-all duration-200"
        >
          {t("common.close")}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fffbe6] to-[#ffe066] py-10 px-2 md:px-0">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 ml-6 px-6 py-2 rounded-xl bg-gradient-to-r from-[#ffe066] to-[#fd9125] text-white font-bold shadow hover:from-[#fd9125] hover:to-[#ffe066] transition-all duration-200"
      >
        {t("common.backToBooking")}
      </button>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
        className="max-w-7xl mx-auto bg-white rounded-[2.5rem] shadow-2xl p-10 md:p-16 border-4 border-[#ffe066] flex flex-col md:flex-row gap-8"
      >
        {/* Chọn ghế */}
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
                  Suất:{" "}
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
                <span className="text-gray-400">{t("movie.notSelected")}</span>
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
              onClick={() => navigate(-1)}
              className="flex-1 py-2 rounded-xl bg-white border-2 border-[#fd9125] text-[#fd9125] font-bold hover:bg-[#ffe066] transition"
            >
              {t("movie.backToBooking")}
            </button>
            <button
              disabled={selectedSeats.length === 0 || paymentSuccess}
              onClick={handlePayment}
              className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#ffe066] to-[#fd9125] text-white font-bold shadow hover:from-[#fd9125] hover:to-[#ffe066] transition disabled:opacity-60"
            >
              {t("payment.pay")}
            </button>
          </div>
        </div>
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
                  {t("payment.paymentSuccess")}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
