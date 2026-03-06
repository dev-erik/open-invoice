import { defineStore } from 'pinia';

export const useLanguageStore = defineStore('language', {
  state: () => ({
    lang: null,
    all: [
      { name: 'English', code: 'en' },
      { name: 'العربية (Arabic)', code: 'ar' },
      { name: 'বাংলা (Bangla)', code: 'bn' },
      { name: 'Deutsch (German)', code: 'de' },
      { name: 'Español (Spanish)', code: 'es' },
      { name: 'Eesti (Estonian)', code: 'et' },
      { name: 'فارسی (Persian)', code: 'fa' },
      { name: 'Français (French)', code: 'fr' },
      { name: 'Bahasa Indonesia', code: 'id' },
      { name: 'Italiano (Italian)', code: 'it' },
      { name: '日本語 (Japanese)', code: 'ja' },
      { name: '한국어 (Korean)', code: 'kr' },
      { name: 'Nederlands (Dutch)', code: 'nl' },
      { name: 'Português (BR)', code: 'pt_br' },
      { name: 'Русский (Russian)', code: 'ru' },
      { name: '中文 (Chinese)', code: 'zh' },
    ],
  }),
  actions: {
    changeLanguage(lang, { i18next, router, route }) {
      i18next.changeLanguage(lang.code);
      router.push({ query: { ...route.query, lang: lang.code } });
      this.lang = lang;
    },
    initLanguage(code) {
      this.lang = this.all.find(lang => lang.code === code) || null;
    },
  },
});
