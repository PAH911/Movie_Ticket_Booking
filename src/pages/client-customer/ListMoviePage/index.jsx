import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { BsCameraReels } from "react-icons/bs";
import { motion } from "framer-motion";
import { FlameIcon } from "lucide-react";
import Movie from "./movie";
import { useTranslation } from "react-i18next";

export default function ListMoviePage({ movies = [], loading, error }) {
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const safeMovies = Array.isArray(movies) ? movies : [];
  const totalPages =
    safeMovies.length > 0 ? Math.ceil(safeMovies.length / pageSize) : 1;
  const pagedMovies = safeMovies.slice((page - 1) * pageSize, page * pageSize);
  const { t } = useTranslation();

  if (loading) {
    return <div>{t("listMovie.loading")}</div>;
  }
  if (error) {
    return (
      <div className="text-red-500 text-center my-4 text-lg font-semibold">
        {t("listMovie.error")}: {error.message || t("listMovie.errorDefault")}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff5cc]">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold mb-10 text-center flex justify-center items-center gap-3">
          <BsCameraReels className="text-[#fd9125] text-5xl drop-shadow-lg" />
          <span className="bg-gradient-to-r from-[#fd9125] to-[#ffe066] text-transparent bg-clip-text flex items-center gap-2 drop-shadow-lg">
            {t("listMovie.nowShowing")}
            <FlameIcon
              className="w-8 h-8 text-[#fd9125] animate-bounce"
              fill="#fd9125"
              stroke="none"
            />
          </span>
        </h1>
        <div className="relative min-h-[300px]">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {pagedMovies.map((movie, index) => (
              <Movie key={movie.maPhim} movie={movie} index={index} />
            ))}
          </motion.div>
        </div>
        <div className="flex justify-center items-center space-x-2 mt-12">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg border-2
              ${
                page === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300"
                  : "bg-gradient-to-r from-[#ffe066] to-[#fd9125] text-white border-[#fd9125] hover:from-[#fd9125] hover:to-[#ffe066] hover:text-white"
              }
            `}
          >
            {t("listMovie.pagePrev")}
          </button>
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            return (
              <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg border-2
                  ${
                    page === pageNumber
                      ? "bg-[#fd9125] text-white border-[#fd9125] scale-110"
                      : "bg-white text-[#fd9125] border-[#ffe066] hover:bg-[#ffe066] hover:text-[#fd9125]"
                  }
                `}
              >
                {pageNumber}
              </button>
            );
          })}
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg border-2
              ${
                page === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300"
                  : "bg-gradient-to-r from-[#ffe066] to-[#fd9125] text-white border-[#fd9125] hover:from-[#fd9125] hover:to-[#ffe066] hover:text-white"
              }
            `}
          >
            {t("listMovie.pageNext")}
          </button>
        </div>
      </div>
    </div>
  );
}
