<template>
    <footer class="row text-secondary px-0 mt-3 d-print-none">
        <div class="col-md-4">
            <LanguageSwitcher class="ms-n2 ms-md-0"/>
            <button class="btn btn-sm text-secondary" @click="toggleTheme">
                {{ theme === 'dark' ? $t('the-footer:lights-on') : $t('the-footer:lights-off') }}
                <i class="material-icons material-icons-round md-14 align-text-bottom ms-1">
                    {{ theme === 'dark' ? 'wb_sunny' : 'brightness_2' }}
                </i>
            </button>
        </div>
        <div class="col-md-8 text-start text-md-end">
            <small :title="$t('the-footer:title')"
                   class="pointer"
                   v-if="!isStorageWordpress">
                {{ $t('the-footer:what_about_my_data') }}
            </small>
            <small class="ps-2">
                {{ $t('the-footer:made_with') }}
                <i class="material-icons material-icons-round md-14 align-text-bottom">favorite</i>
                {{ $t('the-footer:by') }}
                <a href="https://mokuapp.io/" class="text-secondary" target="_blank">Moku</a>.
            </small>
            <a href="https://github.com/mokuappio/serverless-invoices"
               class="btn btn-sm btn--icon ms-0 ms-md-2"
               target="_blank"
               v-if="!isStorageWordpress">
                <img src="@/assets/img/github.png"
                     alt="Serverless Invoices Github"
                     v-if="theme === 'dark'">
                <img src="@/assets/img/github-dark.png"
                     alt="Serverless Invoices Github"
                     v-else>
            </a>
            <a href="https://app.mokuapp.io/"
               class="btn btn-sm btn-primary ms-2"
               target="_blank"
               v-if="!isStorageWordpress">{{ $t('the-footer:upgrade') }}</a>
        </div>
    </footer>
</template>

<script>
import config from '@/config/app.config';
import { useThemesStore } from '@/store/themes';
import LanguageSwitcher from './LanguageSwitcher.vue';

export default {
  components: { LanguageSwitcher },
  computed: {
    theme() {
      return useThemesStore().theme;
    },
    isStorageWordpress() {
      return config.storageType === 'wordpress';
    },
  },
  methods: {
    toggleTheme() {
      const themesStore = useThemesStore();
      if (this.theme === 'light') {
        themesStore.setTheme('dark');
      } else {
        themesStore.setTheme('light');
      }
      localStorage.setItem('theme', this.theme);
      document.documentElement.setAttribute('data-theme', this.theme);
    },
  },
};
</script>
