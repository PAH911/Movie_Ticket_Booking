import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTicketInfo } from "./slice";
import ClipLoader from "react-spinners/ClipLoader";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function BuyTicket() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.buyTicketSlice);
  const { isLoggedIn } = useSelector((state) => state.authCustomerReducer);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchTicketInfo(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("Vui lòng đăng nhập để đặt vé!");
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#AC98E0" size={50} />
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 text-center mt-10">
        Lỗi tải dữ liệu: {error.message}
      </div>
    );

  if (!data) return null;

  const handleSeatClick = (seatCode) => {
    if (selectedSeats.includes(seatCode)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatCode));
    } else {
      setSelectedSeats([...selectedSeats, seatCode]);
    }
  };

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      toast.error("Vui lòng chọn ít nhất một ghế!");
      return;
    }

    // TODO: Implement booking logic
    toast.success("Đặt vé thành công!");
    navigate("/");
  };

  const handlePayment = () => {
    if (!selectedShowtime) return;
    // ... phần còn lại giữ nguyên ...
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Đặt Vé - {data.thongTinPhim.tenPhim}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Chọn Ghế</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="grid grid-cols-8 gap-2">
                {data.danhSachGhe.map((ghe) => (
                  <button
                    key={ghe.maGhe}
                    onClick={() => handleSeatClick(ghe.maGhe)}
                    disabled={ghe.daDat}
                    className={`p-2 rounded ${
                      ghe.daDat
                        ? "bg-red-500 cursor-not-allowed"
                        : selectedSeats.includes(ghe.maGhe)
                        ? "bg-green-500"
                        : "bg-blue-500 hover:bg-blue-600"
                    } text-white transition-colors`}
                  >
                    {ghe.tenGhe}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Thông Tin Đặt Vé</h2>
            <div className="space-y-4">
              <p>
                <span className="font-semibold">Rạp:</span>{" "}
                {data.thongTinPhim.tenCumRap}
              </p>
              <p>
                <span className="font-semibold">Suất chiếu:</span>{" "}
                {new Date(data.thongTinPhim.ngayChieuGioChieu).toLocaleString(
                  "vi-VN"
                )}
              </p>
              <p>
                <span className="font-semibold">Ghế đã chọn:</span>{" "}
                {selectedSeats.length > 0
                  ? selectedSeats.join(", ")
                  : "Chưa chọn ghế"}
              </p>
              <p>
                <span className="font-semibold">Tổng tiền:</span>{" "}
                {selectedSeats.length * 75000} VNĐ
              </p>

              <button
                onClick={handleBooking}
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Đặt Vé
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
