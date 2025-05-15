import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import LoginModal from "../../pages/client-customer/Login";
import RegisterModal from "../../pages/client-customer/Register";
import logo from "../../assets/imgs/cine-logo.png";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import {
  logout,
  openLoginModal,
  closeLoginModal,
} from "../../store/slices/authSlice";
import { useTranslation } from "react-i18next";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const { user, isAuthenticated, showLoginModal } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language || "vi");

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const openLoginModalHandler = () => {
    dispatch(openLoginModal());
    setIsMenuOpen(false);
  };

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleChangeLang = (lng) => {
    i18n.changeLanguage(lng);
    setLang(lng);
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, type: "spring" }}
      className="bg-gradient-to-r from-[#fdbf25] via-[#ffe066] to-[#fdbf25] shadow-lg sticky top-0 z-50 border-b border-[#e0e0e0]"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <NavLink to="/" className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-20 w-auto" />
            <span className="text-2xl font-extrabold text-[#222222] tracking-wide">
              CineGo
            </span>
          </NavLink>

          <nav className="hidden md:flex items-center gap-8 ml-10">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `font-semibold text-lg px-3 py-2 rounded transition-all duration-200 ${
                  isActive
                    ? "text-[#222] bg-white/60 shadow"
                    : "text-[#222] hover:bg-white/30 hover:shadow"
                }`
              }
            >
              {t("common.home")}
            </NavLink>
            <NavLink
              to="/booking"
              className={({ isActive }) =>
                `font-semibold text-lg px-3 py-2 rounded transition-all duration-200 ${
                  isActive
                    ? "text-[#222] bg-white/60 shadow"
                    : "text-[#222] hover:bg-white/30 hover:shadow"
                }`
              }
              onClick={(e) => {
                if (!isAuthenticated) {
                  e.preventDefault();
                  openLoginModalHandler();
                }
              }}
            >
              {t("movie.bookTicket")}
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `font-semibold text-lg px-3 py-2 rounded transition-all duration-200 ${
                  isActive
                    ? "text-[#222] bg-white/60 shadow"
                    : "text-[#222] hover:bg-white/30 hover:shadow"
                }`
              }
            >
              {t("common.about")}
            </NavLink>
            <NavLink
              to="/promotion"
              className={({ isActive }) =>
                `font-semibold text-lg px-3 py-2 rounded transition-all duration-200 ${
                  isActive
                    ? "text-[#222] bg-white/60 shadow"
                    : "text-[#222] hover:bg-white/30 hover:shadow"
                }`
              }
            >
              {t("promotion.title", "Promotion")}
            </NavLink>
            <NavLink
              to="/support"
              className={({ isActive }) =>
                `font-semibold text-lg px-3 py-2 rounded transition-all duration-200 ${
                  isActive
                    ? "text-[#222] bg-white/60 shadow"
                    : "text-[#222] hover:bg-white/30 hover:shadow"
                }`
              }
            >
              {t("common.support")}
            </NavLink>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `font-semibold text-lg px-3 py-2 rounded transition-all duration-200 ${
                  isActive
                    ? "text-[#222] bg-white/60 shadow"
                    : "text-[#222] hover:bg-white/30 hover:shadow"
                }`
              }
            >
              {t("common.admin")}
            </NavLink>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => handleChangeLang(lang === "vi" ? "en" : "vi")}
              className={`px-4 py-2 rounded-full font-bold border-2 transition-all duration-200 shadow-sm ${
                lang === "en"
                  ? "bg-[#fd9125] text-white border-[#fd9125]"
                  : "bg-white text-[#fd9125] border-[#ffe066] hover:bg-[#ffe066]/60"
              }`}
              aria-label={t("common.language")}
            >
              {lang === "vi" ? "EN" : "VI"}
            </button>
            {isAuthenticated && user ? (
              <div className="relative group">
                <button className="px-5 py-2 font-bold rounded-full shadow-md border-2 border-transparent bg-[#fff5cc] text-[#fd9125] cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-[#ffe066] hover:to-[#fd9125] hover:text-white hover:border-[#fd9125] focus:outline-none focus:ring-2 focus:ring-[#fd9125]">
                  {user.hoTen}
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  <NavLink
                    to="/myticket"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    {t("user.myTickets")}
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    {t("common.logout")}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={openLoginModalHandler}
                  className="px-5 py-2 font-bold rounded-xl shadow border-2 border-[#ff9a3b] text-[#ff9a3b] bg-white hover:bg-[#ff893b] hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#ff9a3b]"
                >
                  {t("common.login")}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={openRegisterModal}
                  className="px-5 py-2 font-bold rounded-xl shadow border-2 border-[#fdbf25] bg-gradient-to-r from-[#ffe066] to-[#fdbf25] text-[#222222] hover:bg-[#fff5cc] hover:text-[#fdbf25] hover:from-[#fff5cc] hover:to-[#ffe066] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#fdbf25]"
                >
                  {t("common.register")}
                </motion.button>
              </>
            )}
          </div>

          <button className="md:hidden text-[#222222]" onClick={toggleMenu}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white shadow-lg rounded-lg mt-2 p-4"
          >
            <nav className="flex flex-col space-y-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "text-[#fdbf25] font-bold"
                    : "text-[#222222] font-medium"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {t("common.home")}
              </NavLink>
              <NavLink
                to="/booking"
                className={({ isActive }) =>
                  isActive
                    ? "text-[#fdbf25] font-bold"
                    : "text-[#222222] font-medium"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {t("movie.bookTicket")}
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive
                    ? "text-[#fdbf25] font-bold"
                    : "text-[#222222] font-medium"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {t("common.about")}
              </NavLink>
              <NavLink
                to="/promotion"
                className={({ isActive }) =>
                  isActive
                    ? "text-[#fdbf25] font-bold"
                    : "text-[#222222] font-medium"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {t("promotion.title", "Promotion")}
              </NavLink>
              <NavLink
                to="/support"
                className={({ isActive }) =>
                  isActive
                    ? "text-[#fdbf25] font-bold"
                    : "text-[#222222] font-medium"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {t("common.support")}
              </NavLink>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={openLoginModalHandler}
                className="text-[#ff9a3b] font-semibold px-4 py-2 rounded-lg border border-[#ff9a3b] bg-white hover:bg-[#ff893b] hover:text-white transition"
              >
                {t("common.login")}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={openRegisterModal}
                className="bg-[#fdbf25] text-[#222222] font-bold px-4 py-2 rounded-lg border-2 border-[#fdbf25] shadow hover:bg-white hover:text-[#fdbf25] transition"
              >
                {t("common.register")}
              </motion.button>
            </nav>
          </motion.div>
        )}
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => dispatch(closeLoginModal())}
        onRegister={() => {
          dispatch(closeLoginModal());
          setIsRegisterModalOpen(true);
        }}
      />

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onLogin={() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
    </motion.header>
  );
}
