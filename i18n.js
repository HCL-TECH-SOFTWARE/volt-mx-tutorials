import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import XHR from 'i18next-http-backend';

export const locales = ['en-US', 'zh-CN', 'zh-TW', 'hi-IN'];
export const defaultLocale = 'en-US';

const detection = {
  // order and from where user language should be detected
  order: ['querystring'],
  lookupQuerystring: 'lang',
};
const getProdUrl = process.env.NODE_ENV === 'production' ? '/volt-mx-tutorials' : '';

i18next
  .use(XHR)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    detection,
    fallbackLng: {
      en: ['en-US'],
      zh: ['zh-CN'],
      default: [defaultLocale],
    },
    backend: {
      loadPath: `${getProdUrl}/locales/{{lng}}/{{ns}}.json`,
    },
    returnObjects: true,
    debug: false,
    interpolation: {
      escapeValue: false, // not needed for react!!
    },
  });

export default i18next;
