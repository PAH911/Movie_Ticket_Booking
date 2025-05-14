import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { register } from "../../../store/slices/authSlice";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import cineLogo from "../../../assets/imgs/cine-logo.png";

function getRegisterSchema(t) {
  return Yup.object().shape({
    taiKhoan: Yup.string().required(t("auth.requiredAccount")),
    matKhau: Yup.string()
      .min(6, t("auth.passwordMin"))
      .required(t("auth.requiredPassword")),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("matKhau"), null], t("auth.passwordNotMatch"))
      .required(t("auth.requiredConfirmPassword")),
    email: Yup.string()
      .email(t("auth.invalidEmail"))
      .required(t("auth.requiredEmail")),
    soDt: Yup.string()
      .matches(/^[0-9]{10}$/, t("auth.invalidPhone"))
      .required(t("auth.requiredPhone")),
    hoTen: Yup.string().required(t("auth.requiredFullName")),
  });
}

export default function Register({ isOpen, onClose, onLogin }) {
  if (!isOpen) return null;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, verificationStatus } = useSelector((state) => state.auth);
  const [verificationStep, setVerificationStep] = useState("register"); // chỉ còn register
  const [registerFormData, setRegisterFormData] = useState({
    taiKhoan: "",
    matKhau: "",
    confirmPassword: "",
    email: "",
    soDt: "",
    hoTen: "",
  });
  const { t } = useTranslation();
  const RegisterSchema = getRegisterSchema(t);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(register(values)).unwrap();
      toast.success(t("auth.registerSuccess"));
      if (onLogin) onLogin();
      if (onClose) onClose();
    } catch (error) {
      toast.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (verificationStep === "register") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-2xl w-[600px] relative p-8 border-4 border-[#ffe066]"
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
            initialValues={registerFormData}
            validationSchema={RegisterSchema}
            onSubmit={(values, actions) => {
              const { confirmPassword, ...submitValues } = values;
              setRegisterFormData(values);
              handleSubmit(submitValues, actions);
            }}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="taiKhoan"
                        className="block text-sm font-medium text-[#ff9a3b]"
                      >
                        {t("auth.email")}
                      </label>
                      <Field
                        id="taiKhoan"
                        name="taiKhoan"
                        type="text"
                        className={`mt-1 block w-full rounded-xl border-2 border-[#ffe066] px-4 py-2 text-lg focus:ring-2 focus:ring-[#ff9a3b] focus:border-[#ff9a3b] transition placeholder-[#ffb84d] ${
                          errors.taiKhoan && touched.taiKhoan
                            ? "border-red-400"
                            : ""
                        }`}
                        placeholder={t("auth.email")}
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
                        className={`mt-1 block w-full rounded-xl border-2 border-[#ffe066] px-4 py-2 text-lg focus:ring-2 focus:ring-[#ff9a3b] focus:border-[#ff9a3b] transition placeholder-[#ffb84d] ${
                          errors.matKhau && touched.matKhau
                            ? "border-red-400"
                            : ""
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
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-[#ff9a3b]"
                      >
                        {t("auth.confirmPassword")}
                      </label>
                      <Field
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        className={`mt-1 block w-full rounded-xl border-2 border-[#ffe066] px-4 py-2 text-lg focus:ring-2 focus:ring-[#ff9a3b] focus:border-[#ff9a3b] transition placeholder-[#ffb84d] ${
                          errors.confirmPassword && touched.confirmPassword
                            ? "border-red-400"
                            : ""
                        }`}
                        placeholder={t("auth.confirmPassword")}
                      />
                      {errors.confirmPassword && touched.confirmPassword && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.confirmPassword}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-[#ff9a3b]"
                      >
                        {t("auth.email")}
                      </label>
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        className={`mt-1 block w-full rounded-xl border-2 border-[#ffe066] px-4 py-2 text-lg focus:ring-2 focus:ring-[#ff9a3b] focus:border-[#ff9a3b] transition placeholder-[#ffb84d] ${
                          errors.email && touched.email ? "border-red-400" : ""
                        }`}
                        placeholder={t("auth.email")}
                      />
                      {errors.email && touched.email && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.email}
                        </div>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="soDt"
                        className="block text-sm font-medium text-[#ff9a3b]"
                      >
                        {t("auth.phone")}
                      </label>
                      <Field
                        id="soDt"
                        name="soDt"
                        type="text"
                        className={`mt-1 block w-full rounded-xl border-2 border-[#ffe066] px-4 py-2 text-lg focus:ring-2 focus:ring-[#ff9a3b] focus:border-[#ff9a3b] transition placeholder-[#ffb84d] ${
                          errors.soDt && touched.soDt ? "border-red-400" : ""
                        }`}
                        placeholder={t("auth.phone")}
                      />
                      {errors.soDt && touched.soDt && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.soDt}
                        </div>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="hoTen"
                        className="block text-sm font-medium text-[#ff9a3b]"
                      >
                        {t("auth.fullName")}
                      </label>
                      <Field
                        id="hoTen"
                        name="hoTen"
                        type="text"
                        className={`mt-1 block w-full rounded-xl border-2 border-[#ffe066] px-4 py-2 text-lg focus:ring-2 focus:ring-[#ff9a3b] focus:border-[#ff9a3b] transition placeholder-[#ffb84d] ${
                          errors.hoTen && touched.hoTen ? "border-red-400" : ""
                        }`}
                        placeholder={t("auth.fullName")}
                      />
                      {errors.hoTen && touched.hoTen && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.hoTen}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={loading || isSubmitting}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-[#ffe066] to-[#ffb84d] text-[#222] font-bold text-lg shadow hover:from-[#ffb84d] hover:to-[#ffe066] hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#ff9a3b] disabled:opacity-60"
                  >
                    {loading ? t("common.loading") : t("auth.register")}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              {t("auth.haveAccount")}{" "}
              <button
                onClick={onLogin}
                className="text-[#ff9a3b] hover:underline font-medium"
              >
                {t("auth.login")}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Xác thực Số Điện Thoại
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Vui lòng nhập mã xác thực đã được gửi đến số điện thoại của bạn
          </p>
        </div>
        <Formik
          initialValues={{ verificationCode: "" }}
          onSubmit={handlePhoneVerification}
        >
          {({ isSubmitting }) => (
            <Form className="mt-8 space-y-6">
              <div>
                <Field
                  name="verificationCode"
                  type="text"
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                  placeholder="Nhập mã xác thực"
                />
              </div>
              <div className="flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={loading || isSubmitting}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Xác thực Số Điện Thoại
                </button>
                <button
                  type="button"
                  onClick={() => setVerificationStep("register")}
                  className="w-full py-2 rounded-xl bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-all duration-200"
                >
                  Quay lại đăng ký
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </motion.div>
    </div>
  );
}
