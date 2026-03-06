import localForage from 'localforage';
import MigrationService from '@/services/migration.service';
import { download } from '../utils/helpers';

export default {
  namespaced: true,
  state: {
    isImportModalOpen: false,
  },
  mutations: {
    isImportModalOpen(state, isOpen) {
      state.isImportModalOpen = isOpen;
    },
  },
  actions: {
    async migrate() {
      return MigrationService.migrate();
    },
    async exportJson() {
      let results = [];
      const keys = await localForage.keys();
      keys.forEach((key) => {
        results.push(localForage.getItem(key));
      });
      results = await Promise.all(results);

      const data = {};
      keys.forEach((key, index) => {
        data[key] = results[index];
      });

      download(JSON.stringify(data), 'serverless-invoices.json', 'application/json');
    },
    async importJson({ dispatch }, data) {
      const ALLOWED_KEYS = [
        'invoices', 'invoice_rows', 'invoice_row_taxes',
        'invoice_client_fields', 'invoice_team_fields',
        'clients', 'client_fields',
        'bank_accounts', 'taxes',
        'team', 'team_fields',
      ];
      const results = [];
      Object.keys(data)
        .filter(key => ALLOWED_KEYS.includes(key))
        .forEach((key) => {
          results.push(localForage.setItem(key, data[key]));
        });
      await Promise.all(results);
      await dispatch('teams/terminate', null, { root: true });
      return dispatch('teams/init', null, { root: true });
    },
  },
  getters: {},
};
