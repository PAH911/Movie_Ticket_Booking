import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { login } from "../../../store/slices/authSlice";
import { toast } from "react-toastify";
import cineLogo from "../../../assets/imgs/cine-logo.png";
import { useTranslation } from "react-i18next";

export default function Login({ isOpen, onClose, onRegister }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, isAuthenticated } = useSelector((state) => state.auth);
  const { t } = useTranslation();

  const LoginSchema = Yup.object().shape({
    taiKhoan: Yup.string().required(t("auth.requiredAccount")),
    matKhau: Yup.string().required(t("auth.requiredPassword")),
  });

  useEffect(() => {
    if (isAuthenticated && isOpen) {
      onClose();
      setTimeout(() => {
        navigate("/");
      }, 300);
    }
  }, [isAuthenticated, navigate, onClose]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(login(values)).unwrap();
      toast.success(t("auth.loginSuccess"));
    } catch (error) {
      toast.error(error.message || t("auth.invalidCredentials"));
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-3xl shadow-2xl w-[400px] relative p-8 border-4 border-[#ffe066]"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
        <div className="flex flex-col items-center mb-6">
          <img
            src={cineLogo}
            alt="CineGo Logo"
            className="h-32 w-auto drop-shadow-lg"
          />
        </div>
        <Formik
          initialValues={{ taiKhoan: "", matKhau: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <label
                  htmlFor="taiKhoan"
                  className="block text-sm font-medium text-[#ff9a3b]"
                >
                  {t("auth.account")}
                </label>
                <Field
                  id="taiKhoan"
                  name="taiKhoan"
                  type="text"
                  autoComplete="username"
                  className={`mt-1 block w-full rounded-xl border-2 border-[#ffe066] px-4 py-2 text-lg focus:ring-2 focus:ring-[#ff9a3b] focus:border-[#ff9a3b] transition placeholder-[#ffb84d] ${
                    errors.taiKhoan && touched.taiKhoan ? "border-red-400" : ""
                  }`}
                  placeholder={t("auth.account")}
                />
                {errors.taiKhoan && touched.taiKhoan && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.taiKhoan}
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor="matKhau"
                  className="block text-sm font-medium text-[#ff9a3b]"
                >
                  {t("auth.password")}
                </label>
                <Field
                  id="matKhau"
                  name="matKhau"
                  type="password"
                  autoComplete="current-password"
                  className={`mt-1 block w-full rounded-xl border-2 border-[#ffe066] px-4 py-2 text-lg focus:ring-2 focus:ring-[#ff9a3b] focus:border-[#ff9a3b] transition placeholder-[#ffb84d] ${
                    errors.matKhau && touched.matKhau ? "border-red-400" : ""
                  }`}
                  placeholder={t("auth.password")}
                />
                {errors.matKhau && touched.matKhau && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.matKhau}
                  </div>
                )}
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading || isSubmitting}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-[#ffe066] to-[#ffb84d] text-[#222] font-bold text-lg shadow hover:from-[#ffb84d] hover:to-[#ffe066] hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#ff9a3b] disabled:opacity-60"
                >
                  {loading ? t("common.loading") : t("common.login")}
                </button>
              </div>
            </Form>
          )}
        </Formik>
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            {t("auth.notHaveAccount")}{" "}
            <button
              onClick={onRegister}
              className="text-[#ff9a3b] hover:underline font-medium"
            >
              {t("auth.register")}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
