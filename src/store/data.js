import { defineStore } from 'pinia';
import localForage from 'localforage';
import MigrationService from '@/services/migration.service';
import { download } from '@/utils/helpers';

const ALLOWED_KEYS = [
  'invoices', 'invoice_rows', 'invoice_row_taxes',
  'invoice_client_fields', 'invoice_team_fields',
  'clients', 'client_fields',
  'bank_accounts', 'taxes',
  'team', 'team_fields',
];

export const useDataStore = defineStore('data', {
  state: () => ({
    isImportModalOpen: false,
  }),
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
    async importJson(data) {
      const { useTeamsStore } = await import('@/store/teams');
      const teamsStore = useTeamsStore();

      const results = [];
      Object.keys(data)
        .filter(key => ALLOWED_KEYS.includes(key))
        .forEach((key) => {
          results.push(localForage.setItem(key, data[key]));
        });
      await Promise.all(results);
      teamsStore.terminate();
      return teamsStore.init();
    },
  },
});
