import React, { createContext, useContext, useState } from "react";

const translations = {
  nl: {
    home_title: "BTD Dordrecht",
    home_tagline: "Uw specialist in hang- en sluitwerk en toegangscontrole.",
    who_we_are: "Wie We Zijn",
    who_we_are_text1: "BTD Dordrecht is uw partner voor mechanische en elektronische toegangscontrole. Wij bieden innovatieve oplossingen voor bedrijven en particulieren.",
    who_we_are_text2: "Wij geloven in kwaliteit, betrouwbaarheid en service. Ontdek onze producten en diensten voor een veilige toekomst.",
    more_info: "meer info",
    webshop: "Webshop",
    cart: "Winkelwagen",
    login: "Inloggen",
    register: "Registreren",
    // ...add more keys as needed
  },
  en: {
    home_title: "BTD Dordrecht",
    home_tagline: "Your specialist in locks and access control.",
    who_we_are: "Who We Are",
    who_we_are_text1: "BTD Dordrecht is your partner for mechanical and electronic access control. We offer innovative solutions for businesses and individuals.",
    who_we_are_text2: "We believe in quality, reliability, and service. Discover our products and services for a secure future.",
    more_info: "more info",
    webshop: "Webshop",
    cart: "Cart",
    login: "Login",
    register: "Register",
    // ...add more keys as needed
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("nl");
  const toggleLanguage = () => setLanguage((lang) => (lang === "nl" ? "en" : "nl"));
  const t = (key) => translations[language][key] || key;
  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
} 