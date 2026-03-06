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
            <small class="pointer position-relative data-info-trigger"
                   v-if="!isStorageWordpress">
                <i class="material-icons md-14 align-text-bottom">info_outline</i>
                {{ $t('the-footer:what_about_my_data') }}
                <div class="data-info-popover">
                    <div class="data-info-popover__content">
                        {{ $t('the-footer:title') }}
                    </div>
                </div>
            </small>
            <small class="ps-2">
                Open Invoice
            </small>
            <a href="https://github.com/dev-erik/open-invoice"
               class="btn btn-sm btn--icon ms-0 ms-md-2"
               target="_blank"
               v-if="!isStorageWordpress">
                <img src="@/assets/img/github.png"
                     alt="Open Invoice on GitHub"
                     v-if="theme === 'dark'">
                <img src="@/assets/img/github-dark.png"
                     alt="Open Invoice on GitHub"
                     v-else>
            </a>
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

<style lang="scss" scoped>
.data-info-trigger {
  display: inline-block;
}

.data-info-popover {
  position: absolute;
  bottom: 2rem;
  right: 0;
  z-index: 50;
  max-width: 360px;
  width: max-content;
  display: none;

  &__content {
    background: var(--bg-primary);
    border: 1px solid var(--text-caption);
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    font-size: 0.8rem;
    color: var(--text-secondary);
    line-height: 1.5;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
}

.data-info-trigger:hover .data-info-popover {
  display: block;
}
</style>
