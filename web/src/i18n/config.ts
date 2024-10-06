import i18n from "i18next";
// Bindings for React: allow components to
// re-render when language changes.
import enUS from 'antd/lib/locale/en_US';
import ptBR from 'antd/lib/locale/pt_BR';
import ptPT from 'antd/lib/locale/pt_PT';
import esEs from 'antd/lib/locale/es_ES';

import 'dayjs/locale/pt-br.js'
import 'dayjs/locale/pt.js'
import 'dayjs/locale/es.js'
import 'dayjs/locale/es-us.js'
import 'dayjs/locale/en.js'

import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import { Locale } from "antd/lib/locale";


export const supportedLngs:Record<string, {antLocale: Locale, name:string, daysLocale:string}> = {
  "en-US": {
    antLocale: enUS,
    daysLocale: 'en',
    name: "English",
  },
  "en": {
    antLocale: enUS,
    daysLocale: 'en',
    name: "English",
  },
  "pt-BR": {
    antLocale: ptBR,
    daysLocale: 'pt-br',
    name: "Português",
  },
  "pt": {
    antLocale: ptPT,
    daysLocale: 'pt',
    name: "Português",
  },
  "es": {
    antLocale: esEs,
    daysLocale: 'es',
    name: "Español",
  },
  "es-US": {
    antLocale: esEs,
    daysLocale: 'es-us',
    name: "Español",
  }
};

i18n
  // Add React bindings as a plugin.
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpApi)

  // Initialize the i18next instance.
  .init({

    fallbackLng: "en",

    debug: true,

    interpolation: {
      escapeValue: false,
    },

  });

export default i18n;
