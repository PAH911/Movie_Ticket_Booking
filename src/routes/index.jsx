import { createBrowserRouter, Navigate, useLocation } from "react-router-dom";
import HomePage from "../pages/client-customer/HomePage";
import About from "../pages/client-customer/About";
import BookingPage from "../pages/client-customer/BookingPage/BookingPage";
import MyTicket from "../pages/client-customer/MyTickets";
import MovieDetailPage from "../pages/client-customer/MovieDetailPage";
import Promotions from "../pages/client-customer/Promotions";
import Support from "../pages/client-customer/Support";
import PaymentPage from "../pages/client-customer/PaymentPage/PaymentPage";
import { useSelector } from "react-redux";
import AdminTemplate from "../pages/client-admin";
import MovieManagerPage from "../pages/client-admin/MovieManagerPage";
import ShowtimeManagerPage from "../pages/client-admin/ShowtimeManagerPage";
import UserManagerPage from "../pages/client-admin/UserManagerPage";
import ReportPage from "../pages/client-admin/ReportPage";
import AuthPage from "../pages/client-admin/AuthPage";
import { motion } from "framer-motion";

function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();
  if (!isAuthenticated) {
    // Có thể chuyển sang modal đăng nhập nếu muốn, ở đây sẽ redirect về trang chủ
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children;
}

function AdminProtectedRoute({ children }) {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  if (!user)
    return <Navigate to="/admin/auth" state={{ from: location }} replace />;
  if (user.maLoaiNguoiDung !== "QuanTri") {
    // Có thể cho logout hoặc hiển thị thông báo, KHÔNG redirect liên tục về /admin/auth
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-400 to-gray-900">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-black p-8 rounded-2xl shadow-2xl w-96 text-white text-center border-2 border-red-500"
        >
          <h2 className="text-2xl font-bold mb-4 animate-pulse">
            Bạn không có quyền truy cập trang quản trị!
          </h2>
        </motion.div>
      </div>
    );
  }
  return children;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/booking",
    element: (
      <ProtectedRoute>
        <BookingPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/myticket",
    element: (
      <ProtectedRoute>
        <MyTicket />
      </ProtectedRoute>
    ),
  },
  {
    path: "/detail/:maPhim",
    element: <MovieDetailPage />,
  },
  {
    path: "/promotion",
    element: <Promotions />,
  },
  {
    path: "/support",
    element: <Support />,
  },
  {
    path: "/payment",
    element: <PaymentPage />,
  },
  {
    path: "/admin/auth",
    element: <AuthPage />,
  },
  {
    path: "/admin",
    element: (
      <AdminProtectedRoute>
        <AdminTemplate />
      </AdminProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <div className="p-8 text-2xl font-bold">Dashboard</div>,
      },
      { path: "movie", element: <MovieManagerPage /> },
      { path: "showtime", element: <ShowtimeManagerPage /> },
      { path: "user", element: <UserManagerPage /> },
      { path: "report", element: <ReportPage /> },
    ],
  },
  {
    path: "*",
    element: (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-purple-600 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">Không tìm thấy trang</p>
          <a href="/" className="text-purple-600 hover:text-purple-700">
            Quay về trang chủ
          </a>
        </div>
      </div>
    ),
  },
]);

export default router;
