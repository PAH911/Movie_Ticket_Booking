import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Clock, Calendar } from "lucide-react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { openLoginModal } from "../../../store/slices/authSlice";
import { useTranslation } from "react-i18next";

export default function Movie({ movie, index }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { t } = useTranslation();

  const handleBookNow = () => {
    if (!isAuthenticated) {
      dispatch(openLoginModal());
    } else {
      navigate(`/detail/${movie.maPhim}`);
    }
  };

  const { data, loading, error, showtimes } = useSelector(
    (state) => state.detailMovie || {}
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{
        scale: 1.04,
        boxShadow: "0 8px 32px 0 rgba(253,191,37,0.15)",
      }}
      className="bg-white rounded-2xl border border-[#fdbf25] shadow-md overflow-hidden flex flex-col transition-all duration-300"
    >
      <img
        src={movie.hinhAnh}
        alt={movie.tenPhim}
        className="w-full h-56 object-cover rounded-t-2xl border-b border-[#e0e0e0]"
      />
      <div className="flex-1 flex flex-col p-4">
        <h3 className="text-xl font-bold text-[#222222] mb-2 line-clamp-2">
          {movie.tenPhim}
        </h3>
        <div className="flex items-center gap-2 mb-2 text-[#6b6b6b] text-sm">
          <Star className="w-5 h-5 text-[#fdbf25]" fill="#fdbf25" />
          <span className="font-semibold text-[#222222]">
            {movie.danhGia || 0}
          </span>
          <Clock className="w-4 h-4 ml-4 text-[#3b9cff]" />
          <span>{movie.thoiLuong || "120 phút"}</span>
          <Calendar className="w-4 h-4 ml-4 text-[#3b9cff]" />
          <span>{movie.ngayKhoiChieu?.slice(0, 10) || "2024-01-01"}</span>
        </div>
        <p className="text-[#6b6b6b] text-sm mb-4 line-clamp-3">{movie.moTa}</p>
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleBookNow}
          className="mt-auto inline-block text-center bg-[#fdbf25] text-[#222222] font-bold px-4 py-2 rounded-lg shadow hover:bg-[#3b9cff] hover:text-white transition-all duration-300"
        >
          {t("common.bookNow")}
        </motion.button>
      </div>
    </motion.div>
  );
}

Movie.propTypes = {
  movie: PropTypes.shape({
    maPhim: PropTypes.number.isRequired,
    tenPhim: PropTypes.string.isRequired,
    hinhAnh: PropTypes.string.isRequired,
    danhGia: PropTypes.number,
    thoiLuong: PropTypes.string,
    ngayKhoiChieu: PropTypes.string,
    moTa: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
};
