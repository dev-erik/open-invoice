import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router';
import { pinia } from '@/store/store';
import Notifications from '@kyvg/vue3-notification';
import I18NextVue from 'i18next-vue';
import { i18next, initialized } from '@/config/i18n.config';
import { useLanguageStore } from '@/store/language';
import '@/config/local-storage.config';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

NProgress.configure({ showSpinner: false });

initialized.then(() => {
  const app = createApp(App);

  app.use(pinia);
  app.use(router);
  app.use(Notifications);
  app.use(I18NextVue, { i18next });

  const languageStore = useLanguageStore();
  languageStore.initLanguage(i18next.language);

  app.mount('#app');
});
