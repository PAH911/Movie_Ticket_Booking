import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDetailMovie, fetchShowtimes } from "./slice";
import ClipLoader from "react-spinners/ClipLoader";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlay } from "react-icons/fa";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { useTranslation } from "react-i18next";

export default function DetailMoviePage() {
  const { data, loading, error, showtimes } = useSelector(
    (state) => state.detailMovie || {}
  );
  console.log("DetailMoviePage render:", { data, loading, error, showtimes });
  const { maPhim } = useParams();
  const dispatch = useDispatch();
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (maPhim) {
      dispatch(fetchDetailMovie(maPhim));
      dispatch(fetchShowtimes(maPhim));
    }
    window.scrollTo(0, 0);
  }, [maPhim, dispatch]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#AC98E0" size={50} />
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 text-center mt-10">
        {t("movieDetail.error")}: {error.message || error}
      </div>
    );

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-500">{t("movieDetail.notFound")}</div>
      </div>
    );
  }

  // Lấy danh sách hệ thống rạp
  const theaterSystems = showtimes?.heThongRapChieu || [];
  // Lấy danh sách cụm rạp theo hệ thống đã chọn
  const clusters =
    selectedSystem?.cumRapChieu ||
    theaterSystems.find(
      (sys) => sys.maHeThongRap === selectedSystem?.maHeThongRap
    )?.cumRapChieu ||
    [];
  // Lấy danh sách suất chiếu theo cụm rạp đã chọn
  const showtimeList =
    selectedCluster?.lichChieuPhim ||
    clusters.find((c) => c.maCumRap === selectedCluster?.maCumRap)
      ?.lichChieuPhim ||
    [];

  // Group showtimes by date
  const showtimesByDate = {};
  if (selectedCluster && showtimeList.length > 0) {
    showtimeList.forEach((showtime) => {
      const date = new Date(showtime.ngayChieuGioChieu).toLocaleDateString(
        "vi-VN"
      );
      if (!showtimesByDate[date]) showtimesByDate[date] = [];
      showtimesByDate[date].push(showtime);
    });
  }

  const handleSystemSelect = (sys) => {
    setSelectedSystem(sys);
    setSelectedCluster(null);
    setSelectedShowtime(null);
  };
  const handleClusterSelect = (cluster) => {
    setSelectedCluster(cluster);
    setSelectedShowtime(null);
  };
  const handleShowtimeSelect = (showtime) => {
    setSelectedShowtime(showtime);
  };
  const handleBook = () => {
    if (!selectedSystem || !selectedCluster || !selectedShowtime) return;
    navigate("/payment", {
      state: {
        selectedMovie: data,
        selectedSystem,
        selectedCluster,
        selectedShowtime,
      },
    });
  };

  return (
    <>
      <Header />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="relative bg-gray-900 text-white"
      >
        <div
          className="absolute inset-0 bg-cover bg-center blur-lg opacity-50"
          style={{ backgroundImage: `url(${data?.hinhAnh})` }}
        ></div>

        <div className="relative container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12 z-10">
          <div className="md:col-span-1 flex justify-center">
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-80 h-auto rounded-lg shadow-lg"
              src={data?.hinhAnh}
              alt={data?.tenPhim}
            />
          </div>

          <div className="md:col-span-2 space-y-4">
            <h1 className="text-5xl font-bold mb-6">{data?.tenPhim}</h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              {data?.moTa}
            </p>
            <p>
              <strong>{t("movieDetail.releaseDate")}:</strong>{" "}
              {new Date(data?.ngayKhoiChieu).toLocaleDateString()}
            </p>
            <div className="flex items-center gap-4 mt-4">
              <p className="text-yellow-400 text-2xl font-bold">
                ⭐ {data?.danhGia}/10
              </p>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 transition rounded-lg shadow-lg"
                onClick={() => setShowTrailer(true)}
              >
                <FaPlay /> {t("movieDetail.trailer")}
              </motion.button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showTrailer && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
            >
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowTrailer(false)}
                className="absolute top-5 right-5 text-white text-3xl z-50"
              >
                ✖
              </motion.button>

              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="relative w-[80%] max-w-3xl"
              >
                <iframe
                  className="w-full h-[60vh] rounded-lg shadow-lg"
                  src={data?.trailer.replace("watch?v=", "embed/")}
                  title="Trailer"
                  allowFullScreen
                ></iframe>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <div className="flex justify-center items-center min-h-[600px]">
        <div className="bg-white w-full max-w-7xl px-8 py-12 rounded-2xl shadow-lg mt-8">
          <h2 className="text-3xl font-extrabold mb-8 text-center text-transparent bg-gradient-to-r from-[#fd9125] to-[#ffe066] bg-clip-text tracking-tight drop-shadow-lg">
            {t("movieDetail.selectTheater")}
          </h2>
          <div className="flex flex-col justify-evenly md:flex-row gap-6 md:gap- items-center min-h-[420px]">
            {/* Hệ thống rạp */}
            <div className="flex-1 min-w-[160px] max-w-[400px] max-h-[420px] overflow-y-auto">
              <h3 className="font-bold text-lg mb-4 text-[#fd9125]">
                {t("movieDetail.theaterSystem")}
              </h3>
              <div className="m-3">
                {theaterSystems.map((sys) => (
                  <button
                    key={sys.maHeThongRap}
                    onClick={() => handleSystemSelect(sys)}
                    className={`block w-full text-left px-5 py-3 rounded-xl border-2 font-semibold shadow-sm transition-all duration-200 text-base
                      ${
                        selectedSystem?.maHeThongRap === sys.maHeThongRap
                          ? "bg-[#fd9125] text-white border-[#fd9125] scale-105 shadow-lg"
                          : "bg-white text-[#fd9125] border-[#ffe066] hover:bg-[#ffe066]/60 hover:scale-105"
                      }
                    `}
                  >
                    <span className="flex items-center gap-2">
                      <img
                        src={sys.logo}
                        alt={sys.tenHeThongRap}
                        className="h-7 w-7 object-contain rounded bg-white border"
                      />
                      {sys.tenHeThongRap}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            {/* Cụm rạp */}
            <div className="flex-1 min-w-[180px] max-w-[260px] max-h-[420px] overflow-y-auto">
              <h3 className="font-bold text-lg mb-4 text-[#fd9125]">
                {t("movieDetail.theaterCluster")}
              </h3>
              <div className="m-3">
                {selectedSystem ? (
                  clusters.length === 0 ? (
                    <div className="text-gray-400 italic">
                      {t("movieDetail.noCluster")}
                    </div>
                  ) : (
                    clusters.map((cluster) => (
                      <button
                        key={cluster.maCumRap}
                        onClick={() => handleClusterSelect(cluster)}
                        className={`block w-full text-left px-5 py-3 rounded-xl border-2 font-semibold shadow-sm transition-all duration-200 text-base
                          ${
                            selectedCluster?.maCumRap === cluster.maCumRap
                              ? "bg-[#fd9125] text-white border-[#fd9125] scale-105 shadow-lg"
                              : "bg-white text-[#fd9125] border-[#ffe066] hover:bg-[#ffe066]/60 hover:scale-105"
                          }
                        `}
                      >
                        {cluster.tenCumRap}
                      </button>
                    ))
                  )
                ) : (
                  <div className="text-gray-400 italic">
                    Chọn hệ thống rạp trước
                  </div>
                )}
              </div>
            </div>
            {/* Suất chiếu + Nút đặt vé */}
            <div
              className="flex-1 min-w-[220px] max-w-[320px] flex flex-col"
              style={{ height: "420px" }}
            >
              <h3 className="font-bold text-lg mb-4 text-[#fd9125]">
                Suất chiếu
              </h3>
              <div className="flex-1 overflow-y-auto pr-1">
                {selectedCluster ? (
                  Object.keys(showtimesByDate).length === 0 ? (
                    <div className="text-gray-400 italic">
                      Không có suất chiếu
                    </div>
                  ) : (
                    <div className="m-3">
                      {Object.entries(showtimesByDate).map(
                        ([date, showtimes]) => (
                          <div key={date}>
                            <div className="font-semibold text-[#fd9125] mb-2">
                              {date}
                            </div>
                            <div className="grid grid-cols-2 gap-2 mb-2">
                              {showtimes.map((showtime) => (
                                <button
                                  key={showtime.maLichChieu}
                                  onClick={() => handleShowtimeSelect(showtime)}
                                  className={`w-full px-4 py-2 rounded-xl border-2 font-semibold shadow-sm transition-all duration-200 text-base
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
                  <div className="text-gray-400 italic">Chọn cụm rạp trước</div>
                )}
              </div>
              <div className="mt-4 flex justify-end sticky bottom-0 bg-white pt-2 z-10">
                <button
                  onClick={handleBook}
                  disabled={
                    !selectedSystem || !selectedCluster || !selectedShowtime
                  }
                  className="px-8 py-2 rounded-xl bg-gradient-to-r from-[#ffe066] to-[#fd9125] text-white font-bold shadow hover:from-[#fd9125] hover:to-[#ffe066] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#fd9125] disabled:opacity-60 text-lg"
                >
                  Đặt vé
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
