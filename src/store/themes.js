import { defineStore } from 'pinia';

export const useThemesStore = defineStore('themes', {
  state: () => ({
    theme: 'light',
  }),
  actions: {
    setTheme(theme) {
      this.theme = theme;
    },
  },
});
