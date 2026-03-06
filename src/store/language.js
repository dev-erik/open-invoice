import { defineStore } from 'pinia';

export const useLanguageStore = defineStore('language', {
  state: () => ({
    lang: null,
    all: [
      { name: 'English', code: 'en' },
      { name: 'French', code: 'fr' },
      { name: 'Italian', code: 'it' },
      { name: 'Estonian', code: 'et' },
      { name: 'Persian', code: 'fa' },
      { name: 'Spanish', code: 'es' },
      { name: 'Bangla', code: 'bn' },
      { name: 'German', code: 'de' },
      { name: 'Português - BR', code: 'pt_br' },
      { name: 'Indonesian', code: 'id' },
      { name: 'Korean', code: 'kr' },
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
