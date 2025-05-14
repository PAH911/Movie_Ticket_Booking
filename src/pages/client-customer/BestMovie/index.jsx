import { Trophy } from "lucide-react";
import { motion } from "framer-motion";
import Movie from "../ListMoviePage/movie";
import { useTranslation } from "react-i18next";

export default function BestMovie({ movies = [], loading }) {
  const { t } = useTranslation();
  if (loading) return <div>Loading...</div>;
  const safeMovies = Array.isArray(movies) ? movies : [];
  const topMovies = [...safeMovies]
    .sort((a, b) => b.danhGia - a.danhGia)
    .slice(0, 3);

  return (
    <section className="py-16 bg-[#fff5cc]">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-12 justify-center">
          <Trophy className="w-10 h-10 text-[#fd9125] drop-shadow-lg" />
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-[#fd9125] to-[#ffe066] text-transparent bg-clip-text drop-shadow-lg">
            {t("bestMovie.title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topMovies.map((movie, index) => (
            <motion.div
              key={movie.maPhim}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Movie movie={movie} index={index} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
