import { useLanguage } from "../context/LanguageContext";

export default function About() {
  const { t } = useLanguage();
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">{t("about_title")}</h1>
      <p className="mb-4 text-gray-700">{t("about_p1")}</p>
      <p className="mb-4 text-gray-700">{t("about_p2")}</p>
      <ul className="list-disc pl-6 text-gray-700 mb-4">
        <li>{t("about_li1")}</li>
        <li>{t("about_li2")}</li>
        <li>{t("about_li3")}</li>
        <li>{t("about_li4")}</li>
      </ul>
      <p className="text-gray-700">{t("about_contact")}</p>
    </div>
  );
} 