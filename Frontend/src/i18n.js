import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en";
import mr from "./locales/mr";
import hi from "./locales/hi";

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: en
            },
            mr: {
                translation: mr
            },
            hi: {
                translation: hi
            }
        },

        fallbackLng: "en",

        detection: {
            order: ["localStorage", "navigator"],
            caches: ["localStorage"]
        },

        interpolation: {
            escapeValue: false
        }
    });

export default i18n;