import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovieList } from "../../../store/slices/movieSlice";
import BestMovie from "../BestMovie";
import Carousel from "../Carousel";
import ListMoviePage from "../ListMoviePage";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { motion } from "framer-motion";
import ClipLoader from "react-spinners/ClipLoader";
import { useTranslation } from "react-i18next";

export default function HomePage() {
  const dispatch = useDispatch();
  const { movieList, loading, error } = useSelector((state) => state.movies);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchMovieList({ maNhom: "GP01" }));
  }, [dispatch]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader color="#fd9125" size={60} speedMultiplier={1.2} />
      </div>
    );
  if (error) return <div>Error: {error.message || error}</div>;

  return (
    <div className="bg-[#fff5cc] min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring" }}
          className="mb-8"
        >
          <Carousel movies={movieList} loading={loading} />
        </motion.section>
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, type: "spring" }}
          className="mb-8"
        >
          <BestMovie movies={movieList} loading={loading} />
        </motion.section>
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, type: "spring" }}
        >
          <ListMoviePage movies={movieList} loading={loading} error={error} />
        </motion.section>
      </main>
      <Footer />
    </div>
  );
}
