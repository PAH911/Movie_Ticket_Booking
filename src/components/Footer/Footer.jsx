import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { motion } from "framer-motion";
import logo from "../../assets/imgs/cine-logo.png";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  const socialIcons = [
    {
      icon: <Facebook size={24} color="#3b9cff" />,
      label: "Facebook",
      href: "https://facebook.com",
    },
    {
      icon: <Twitter size={24} color="#3b9cff" />,
      label: "Twitter",
      href: "https://twitter.com",
    },
    {
      icon: <Instagram size={24} color="#e94e4e" />,
      label: "Instagram",
      href: "https://instagram.com",
    },
    {
      icon: <Youtube size={24} color="#e94e4e" />,
      label: "Youtube",
      href: "https://youtube.com",
    },
  ];

  return (
    <motion.footer
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, type: "spring" }}
      className="bg-[#fff5cc] border-t border-[#e0e0e0] text-[#222222] mt-12"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-start gap-2">
            <img src={logo} alt="Logo" className="h-20 w-auto mb-2" />
            <h2 className="text-xl font-extrabold text-[#fdbf25] mb-2">
              CineGo
            </h2>
            <p className="text-[#6b6b6b]">{t("footer.description")}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#222222]">
              {t("footer.links")}
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="hover:text-[#3b9cff] transition">
                  {t("common.about")}
                </a>
              </li>
              <li>
                <a href="/support" className="hover:text-[#3b9cff] transition">
                  {t("common.support")}
                </a>
              </li>
              <li>
                <a
                  href="/promotion"
                  className="hover:text-[#3b9cff] transition"
                >
                  {t("promotion.title")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#222222]">
              {t("common.support")}
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-[#e94e4e] transition">
                  {t("footer.terms")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#e94e4e] transition">
                  {t("footer.privacy")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#e94e4e] transition">
                  {t("footer.faq")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#222222]">
              {t("footer.connect")}
            </h3>
            <div className="flex space-x-4 mb-4">
              {socialIcons.map((item, index) => (
                <motion.a
                  whileHover={{ scale: 1.2 }}
                  key={index}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition"
                  aria-label={item.label}
                >
                  {item.icon}
                </motion.a>
              ))}
            </div>
            <div className="text-[#6b6b6b] text-sm">
              {t("footer.hotline")}:{" "}
              <span className="text-[#e94e4e] font-bold">1900 1234</span>
            </div>
            <div className="text-[#6b6b6b] text-sm">
              {t("footer.email")}:{" "}
              <span className="text-[#3b9cff] font-bold">
                support@cinego.vn
              </span>
            </div>
          </div>
        </div>
        <div className="border-t border-[#e0e0e0] mt-8 pt-8 text-center text-[#6b6b6b]">
          <p>&copy; {new Date().getFullYear()} CineGo. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  );
}
