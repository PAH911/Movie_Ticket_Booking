import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { motion } from "framer-motion";
import { HelpCircle, Phone, Mail, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";

const faqs = [
  {
    qKey: "support.faqs.0.q",
    aKey: "support.faqs.0.a",
  },
  {
    qKey: "support.faqs.1.q",
    aKey: "support.faqs.1.a",
  },
  {
    qKey: "support.faqs.2.q",
    aKey: "support.faqs.2.a",
  },
  {
    qKey: "support.faqs.3.q",
    aKey: "support.faqs.3.a",
  },
  {
    qKey: "support.faqs.4.q",
    aKey: "support.faqs.4.a",
  },
];

export default function Support() {
  const { t } = useTranslation();
  return (
    <div className="bg-[#fff5cc] min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-[#fd9125] mb-10 text-center flex items-center justify-center gap-3"
        >
          <HelpCircle className="w-12 h-12 text-[#fd9125]" />
          {t("support.title")}
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-8 border-2 border-[#ffe066] hover:shadow-2xl transition"
            >
              <h2 className="text-xl font-bold text-[#fd9125] mb-2">
                {t(faq.qKey)}
              </h2>
              <p className="text-gray-700">{t(faq.aKey)}</p>
            </motion.div>
          ))}
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-[#ffe066] flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-[#fd9125] font-bold text-lg">
              <Phone />
              {t("support.hotline")}{" "}
              <span className="text-[#e94e4e]">1900 1234</span>
            </div>
            <div className="flex items-center gap-3 text-[#fd9125] font-bold text-lg">
              <Mail />
              {t("support.email")}{" "}
              <span className="text-[#3b9cff]">support@cinego.vn</span>
            </div>
            <div className="flex items-center gap-3 text-[#fd9125] font-bold text-lg">
              <MessageSquare />
              {t("support.chat")}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
