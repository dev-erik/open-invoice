import i18next from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18next
  .use(LanguageDetector)
  .use(Backend);

const initialized = i18next.init({
  fallbackLng: 'en',
  supportedLngs: ['en', 'de', 'fr', 'et', 'fa', 'bn', 'es', 'pt_br', 'it', 'id', 'kr'],
  backend: {
    loadPath: `${window.location.origin}/locales/{{lng}}/{{ns}}.json`,
  },
  detection: {
    order: ['querystring', 'path', 'localStorage', 'navigator'],
    lookupQuerystring: 'lang',
    caches: ['localStorage'],
  },
});

export { i18next, initialized };
