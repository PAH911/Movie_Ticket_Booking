import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { motion } from "framer-motion";
import { Building2, Users, Award, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation();
  const features = [
    {
      icon: <Building2 className="w-12 h-12 text-[#fd9125]" />,
      title: t("about.features.0.title"),
      description: t("about.features.0.desc"),
    },
    {
      icon: <Users className="w-12 h-12 text-[#fd9125]" />,
      title: t("about.features.1.title"),
      description: t("about.features.1.desc"),
    },
    {
      icon: <Award className="w-12 h-12 text-[#fd9125]" />,
      title: t("about.features.2.title"),
      description: t("about.features.2.desc"),
    },
    {
      icon: <Heart className="w-12 h-12 text-[#fd9125]" />,
      title: t("about.features.3.title"),
      description: t("about.features.3.desc"),
    },
  ];

  return (
    <div className="bg-[#fff5cc] min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl font-bold text-[#fd9125] mb-4">
              {t("about.title")}
            </h1>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              {t("about.intro")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow flex flex-col items-center"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-[#fd9125] mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-700 text-center">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 text-center"
          >
            <h2 className="text-3xl font-bold text-[#fd9125] mb-8">
              {t("about.missionTitle")}
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              {t("about.missionDesc")}
            </p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
