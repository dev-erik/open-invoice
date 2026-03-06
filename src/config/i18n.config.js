import i18next from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18next
  .use(LanguageDetector)
  .use(Backend);

const ns = [
  'bank-account-form', 'bank-accounts-list', 'client-fields', 'client-form',
  'client-selector', 'customizations-modal', 'empty-state', 'import-modal',
  'invoice-bank-details', 'invoice-client-details', 'invoice-company-details',
  'invoice-contact-details', 'invoice-controls', 'invoice-form', 'invoice-header',
  'invoice-row', 'invoice-rows-header', 'invoice-totals', 'invoices',
  'invoices-list', 'statuses', 'team-fields', 'team-form', 'team-logo',
  'team-taxes', 'the-footer', 'invoice-vat',
];

const initialized = i18next.init({
  fallbackLng: 'en',
  supportedLngs: ['en', 'ar', 'bn', 'de', 'es', 'et', 'fa', 'fr', 'id', 'it', 'ja', 'kr', 'nl', 'pt_br', 'ru', 'zh'],
  ns,
  defaultNS: false,
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
