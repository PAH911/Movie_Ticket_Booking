import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { useTranslation } from "react-i18next";

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [ticketToCancel, setTicketToCancel] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    // Lấy vé từ localStorage
    let storedTickets = JSON.parse(localStorage.getItem("myTickets") || "[]");
    let updated = false;
    // Nếu vé nào chưa có ngayDat thì thêm ngayDat = thoiGian
    storedTickets = storedTickets.map((ticket) => {
      if (!ticket.ngayDat && ticket.thoiGian) {
        updated = true;
        return { ...ticket, ngayDat: ticket.thoiGian };
      }
      return ticket;
    });
    if (updated) {
      localStorage.setItem("myTickets", JSON.stringify(storedTickets));
    }
    // Sắp xếp vé mới nhất lên đầu dựa vào ngày đặt (ngayDat)
    storedTickets.sort((a, b) => {
      const dateA = a.ngayDat ? new Date(a.ngayDat) : new Date(a.thoiGian);
      const dateB = b.ngayDat ? new Date(b.ngayDat) : new Date(b.thoiGian);
      return dateB - dateA;
    });
    setTickets(storedTickets);
    setLoading(false);
  }, []);

  const handleCancelTicket = (ticket) => {
    setTicketToCancel(ticket);
    setShowConfirm(true);
  };

  const confirmCancel = () => {
    const ticket = ticketToCancel;
    if (!ticket) return;
    // Xóa vé khỏi localStorage
    const updatedTickets = tickets.filter(
      (t) =>
        t.maLichChieu !== ticket.maLichChieu || t.ngayDat !== ticket.ngayDat
    );
    localStorage.setItem("myTickets", JSON.stringify(updatedTickets));
    setTickets(updatedTickets);
    // Cập nhật trạng thái ghế trong localStorage
    const seatStates = JSON.parse(localStorage.getItem("seatStates") || "{}");
    if (seatStates[ticket.maLichChieu]) {
      seatStates[ticket.maLichChieu] = seatStates[ticket.maLichChieu].filter(
        (g) => !ticket.ghe.some((tg) => tg.maGhe === g.maGhe)
      );
      if (seatStates[ticket.maLichChieu].length === 0) {
        delete seatStates[ticket.maLichChieu];
      }
      localStorage.setItem("seatStates", JSON.stringify(seatStates));
    }
    setShowConfirm(false);
    setTicketToCancel(null);
    toast.success("Hủy vé thành công!");
  };

  const cancelPopup = () => {
    setShowConfirm(false);
    setTicketToCancel(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#fd9125]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fffbe6] to-[#ffe066] ">
      <Header />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
        className="max-w-7xl mx-auto"
      >
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#fd9125] my-5">
            {t("myTickets.title")}
          </h1>
          <p className="text-gray-600">{t("myTickets.subtitle")}</p>
        </div>

        {/* Ticket List */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {tickets.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-12"
              >
                <div className="text-gray-500 text-lg mb-4">
                  {t("myTickets.noTicket")}
                </div>
                <button
                  onClick={() => navigate("/booking")}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#ffe066] to-[#fd9125] text-white font-bold shadow hover:from-[#fd9125] hover:to-[#ffe066] transition-all duration-200"
                >
                  {t("myTickets.bookNow")}
                </button>
              </motion.div>
            ) : (
              tickets.map((ticket, index) => (
                <motion.div
                  key={ticket.maLichChieu + ticket.ngayDat}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-[#ffe066] hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Movie Image */}
                  <div className="relative h-48">
                    <img
                      src={ticket.hinhAnh}
                      alt={ticket.tenPhim}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {ticket.tenPhim}
                      </h3>
                      <p className="text-white/80 text-sm">{ticket.tenRap}</p>
                    </div>
                  </div>

                  {/* Ticket Details */}
                  <div className="p-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {t("myTickets.session")}:
                        </span>
                        <span className="font-semibold">
                          {new Date(ticket.thoiGian).toLocaleString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {t("myTickets.seat")}:
                        </span>
                        <span className="font-semibold">
                          {ticket.ghe && Array.isArray(ticket.ghe)
                            ? ticket.ghe.map((g) => g.tenGhe).join(", ")
                            : "-"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {t("myTickets.total")}:
                        </span>
                        <span className="font-semibold text-[#fd9125]">
                          {ticket.tongTien.toLocaleString()}đ
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {t("myTickets.bookingDate")}:
                        </span>
                        <span className="font-semibold">
                          {ticket.ngayDat
                            ? new Date(ticket.ngayDat).toLocaleString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })
                            : "-"}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleCancelTicket(ticket)}
                        className="w-full py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors duration-200"
                      >
                        {t("myTickets.cancel")}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      <Footer />
      {/* Popup xác nhận hủy vé */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center"
            >
              <div className="text-2xl font-bold text-[#fd9125] mb-4">
                {t("myTickets.confirmCancelTitle")}
              </div>
              <div className="mb-6 text-gray-700">
                {t("myTickets.confirmCancelDesc", {
                  movie: ticketToCancel?.tenPhim,
                })}
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={cancelPopup}
                  className="px-6 py-2 rounded-xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                >
                  {t("myTickets.confirmCancelNo")}
                </button>
                <button
                  onClick={confirmCancel}
                  className="px-6 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition"
                >
                  {t("myTickets.confirmCancelYes")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
