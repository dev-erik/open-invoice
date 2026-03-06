<template>
    <div id="app"
         class="min-vh-100"
         :class="$route.name">
        <transition name="fade" mode="out-in">
            <router-view/>
        </transition>
        <notifications position="bottom center" classes="snackbar" width="332"/>
    </div>
</template>

<script>
import { useThemesStore } from '@/store/themes';

export default {
  name: 'app',
  created() {
    this.pauseAnimationsUntilLoaded();
  },
  mounted() {
    this.initColorScheme();
  },
  methods: {
    jsLoaded() {
      document.body.classList.remove('js-loading');
    },
    pauseAnimationsUntilLoaded() {
      document.body.classList.add('js-loading');
      window.addEventListener('load', this.jsLoaded, false);
    },
    initColorScheme() {
      const themesStore = useThemesStore();

      // local storage is used to override OS theme settings
      if (localStorage.getItem('theme')) {
        if (localStorage.getItem('theme') === 'dark') {
          themesStore.setTheme('dark');
          return document.documentElement.setAttribute('data-theme', 'dark');
        }
      } else if (!window.matchMedia) {
        return false;
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        themesStore.setTheme('dark');
        return document.documentElement.setAttribute('data-theme', 'dark');
      }
      document.documentElement.setAttribute('data-theme', themesStore.theme || 'light');
    },
  },
};
</script>

<style lang="scss">
@import './assets/scss/variables';

$body-color: #000;
$body-bg: #fff;

@import 'bootstrap/scss/bootstrap';
@import 'nprogress/nprogress.css';
@import './assets/scss/app';

:root {
  --bs-body-color: var(--text-primary);
  --bs-body-bg: var(--bg-body);
}

body {
  color: var(--text-primary);
  background-color: var(--bg-body);
}
</style>
