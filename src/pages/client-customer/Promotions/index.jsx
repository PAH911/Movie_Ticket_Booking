import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { motion } from "framer-motion";
import { Gift, Percent, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

const promotions = [
  {
    icon: <Gift className="w-10 h-10 text-[#fd9125]" />,
    titleKey: "promotions.list.0.title",
    descKey: "promotions.list.0.desc",
    timeKey: "promotions.list.0.time",
  },
  {
    icon: <Percent className="w-10 h-10 text-[#fd9125]" />,
    titleKey: "promotions.list.1.title",
    descKey: "promotions.list.1.desc",
    timeKey: "promotions.list.1.time",
  },
  {
    icon: <Sparkles className="w-10 h-10 text-[#fd9125]" />,
    titleKey: "promotions.list.2.title",
    descKey: "promotions.list.2.desc",
    timeKey: "promotions.list.2.time",
  },
];

export default function Promotions() {
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
          <Gift className="w-12 h-12 text-[#fd9125]" />
          {t("promotions.title")}
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promotions.map((promo, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border-2 border-[#ffe066] hover:shadow-2xl transition"
            >
              <div className="mb-4">{promo.icon}</div>
              <h2 className="text-2xl font-bold text-[#fd9125] mb-2 text-center">
                {t(promo.titleKey)}
              </h2>
              <p className="text-gray-700 text-center mb-2">
                {t(promo.descKey)}
              </p>
              <div className="text-xs text-[#ff9a3b] font-semibold">
                {t(promo.timeKey)}
              </div>
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
