import { createRouter, createWebHistory } from 'vue-router';
import { i18next, initialized } from '@/config/i18n.config';
import config from '@/config/app.config';

const routes = [
  {
    path: '/',
    name: 'dashboard',
    redirect: 'invoices',
    component: () => import('@/views/dashboard/Dashboard.vue'),
    beforeEnter: async (to, from, next) => {
      const { useTeamsStore } = await import('@/store/teams');
      const teamsStore = useTeamsStore();
      await teamsStore.init();
      next();
    },
    children: [
      {
        path: '/invoices',
        name: 'invoices',
        component: () => import('@/views/dashboard/Invoices.vue'),
      },
      {
        path: '/invoice/:id',
        name: 'invoice',
        component: () => import('@/views/dashboard/Invoice.vue'),
      },
    ],
  },
  {
    path: '/invoices/:id/print',
    name: 'invoice-print',
    component: () => import('@/views/InvoicePrint.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(config.base_url),
  routes,
});

router.beforeEach((to, from, next) => {
  if (!Object.prototype.hasOwnProperty.call(to.query, 'lang')) {
    initialized.then(() => {
      next({ ...to, query: { ...to.query, lang: i18next.language }, replace: true });
    });
  } else {
    next();
  }
});

export default router;
