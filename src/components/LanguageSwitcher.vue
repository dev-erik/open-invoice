<template>
    <div v-if="selectedLang" class="dropdown d-inline-block">
        <button class="btn btn-sm btn-link text-secondary dropdown-toggle"
                type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <span class="text-uppercase">{{ selectedLang.code }}</span>
            <i class="material-icons md-18">expand_more</i>
        </button>
        <ul class="dropdown-menu">
            <li v-for="lang in languages" :key="lang.code">
                <button class="dropdown-item" @click="langChanged(lang)">{{ lang.name }}</button>
            </li>
        </ul>
    </div>
</template>
<script>
import { useLanguageStore } from '@/store/language';
import i18next from 'i18next';

export default {
  name: 'LanguageSwitcher',
  computed: {
    selectedLang() {
      return useLanguageStore().lang;
    },
    languages() {
      return useLanguageStore().all;
    },
  },
  methods: {
    langChanged(lang) {
      useLanguageStore().changeLanguage(lang, {
        i18next,
        router: this.$router,
        route: this.$route,
      });
    },
  },
};
</script>
