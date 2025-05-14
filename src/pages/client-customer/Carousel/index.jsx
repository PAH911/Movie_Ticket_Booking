import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { openLoginModal } from "../../../store/slices/authSlice";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useTranslation } from "react-i18next";

export default function Carousel({ movies = [], loading }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { t } = useTranslation();

  if (loading) {
    return <div>Loading...</div>;
  }

  const safeMovies = Array.isArray(movies) ? movies : [];
  let featuredMovies = [];
  if (safeMovies.length > 10) {
    featuredMovies = safeMovies.slice(5, 10);
  } else if (safeMovies.length > 5) {
    const firstFiveIds = new Set(safeMovies.slice(0, 5).map((m) => m.maPhim));
    const rest = safeMovies.filter((m) => !firstFiveIds.has(m.maPhim));
    featuredMovies = rest.slice(0, 5);
  } else {
    featuredMovies = safeMovies;
  }

  const handleBookNow = (movie) => {
    if (!isAuthenticated) {
      dispatch(openLoginModal());
    } else {
      navigate(`/detail/${movie.maPhim}`);
    }
  };

  return (
    <div className="relative">
      <Swiper
        modules={[Pagination, Navigation, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className="h-[600px] carousel-swiper"
      >
        {featuredMovies.map((movie) => (
          <SwiperSlide key={movie.maPhim}>
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.7, type: "spring" }}
              className="relative h-[500px] flex items-center justify-center mt-7"
            >
              <div className="w-[90%] h-full rounded-3xl shadow-2xl overflow-hidden flex items-stretch bg-white/80 backdrop-blur-md border border-[#ffe066]">
                <div className="relative flex-1 h-full">
                  <img
                    src={movie.hinhAnh}
                    alt={movie.tenPhim}
                    className="w-full h-full object-cover object-center transition-all duration-300"
                    style={{ minHeight: 0, minWidth: 0 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent"></div>
                  <div className="absolute inset-0 bg-white/10"></div>
                </div>
                <div className="flex-1 flex flex-col justify-center px-12 py-10 z-10">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl font-extrabold mb-4 text-[#222] drop-shadow-lg"
                  >
                    {movie.tenPhim}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg mb-8 text-[#333] line-clamp-4 drop-shadow"
                  >
                    {movie.moTa}
                  </motion.p>
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleBookNow(movie)}
                    className="bg-gradient-to-r from-[#fdbf25] to-[#ffe066] text-[#222] font-extrabold px-10 py-4 rounded-2xl shadow-lg border-2 border-[#fdbf25] hover:from-[#ffe066] hover:to-[#fdbf25] hover:text-white transition-all duration-200 text-xl focus:outline-none focus:ring-2 focus:ring-[#fdbf25]"
                  >
                    {t("common.bookNow")}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
      <style>{`
        .carousel-swiper .swiper-pagination-bullet {
          width: 16px;
          height: 16px;
          background: linear-gradient(135deg, #ffe066 0%, #fdbf25 100%);
          opacity: 0.5;
          border-radius: 50%;
          margin: 0 6px !important;
          border: 2px solid #fdbf25;
          transition: all 0.2s;
        }
        .carousel-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          background: linear-gradient(135deg, #fdbf25 0%, #ffe066 100%);
          border: 2px solid #222;
          box-shadow: 0 0 0 4px #fff5cc99;
        }
      `}</style>
    </div>
  );
}
