import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../store/slices/authSlice";
import { Navigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";

const validationSchema = Yup.object({
  taiKhoan: Yup.string().required("Vui lòng nhập tài khoản"),
  matKhau: Yup.string().required("Vui lòng nhập mật khẩu"),
});

export default function AuthPage() {
  const state = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  if (state.user) {
    if (state.user.maLoaiNguoiDung !== "QuanTri") {
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
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-400 to-gray-900">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
        className="bg-black bg-opacity-90 p-8 rounded-2xl shadow-2xl w-full max-w-md border-t-4 border-red-500"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center text-white tracking-wider animate-fade-in">
          Đăng nhập Quản trị
        </h2>
        <Formik
          initialValues={{ taiKhoan: "", matKhau: "" }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            dispatch(login(values));
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-white">
                  Tài khoản
                </label>
                <Field
                  name="taiKhoan"
                  type="text"
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-red-400 focus:outline-none transition-all duration-200"
                  autoComplete="username"
                />
                <ErrorMessage
                  name="taiKhoan"
                  component="div"
                  className="text-red-400 text-xs mt-1 animate-shake"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-white">
                  Mật khẩu
                </label>
                <Field
                  name="matKhau"
                  type="password"
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-red-400 focus:outline-none transition-all duration-200"
                  autoComplete="current-password"
                />
                <ErrorMessage
                  name="matKhau"
                  component="div"
                  className="text-red-400 text-xs mt-1 animate-shake"
                />
              </div>
              {state.error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 text-sm text-red-300 bg-red-900 bg-opacity-40 rounded-lg animate-shake"
                >
                  {typeof state.error === "string"
                    ? state.error
                    : state.error?.response?.data?.content ||
                      "Đăng nhập thất bại"}
                </motion.div>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 px-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:from-pink-500 hover:to-red-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                {isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
              </motion.button>
            </Form>
          )}
        </Formik>
      </motion.div>
    </div>
  );
}
