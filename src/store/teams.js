import { defineStore } from 'pinia';
import TeamService from '@/services/team.service';
import { useDataStore } from '@/store/data';
import { useClientsStore } from '@/store/clients';
import { useBankAccountsStore } from '@/store/bank-accounts';
import { useInvoicesStore } from '@/store/invoices';
import { useTaxesStore } from '@/store/taxes';

const DEFAULT_CUSTOM_CSS = `
/* @import url('https://fonts.googleapis.com/css2?family=Work+Sans:wght@300&display=swap');

.invoice-box:after {
    background: linear-gradient(to bottom, #1C7CE0, #150051);
}

.invoice-box {
    font-family: 'Work Sans', sans-serif;
} */
`;

export const useTeamsStore = defineStore('teams', {
  state: () => ({
    item: null,
    isModalOpen: false,
  }),
  getters: {
    team(state) {
      return state.item;
    },
  },
  actions: {
    async init() {
      const dataStore = useDataStore();
      const clientsStore = useClientsStore();
      const bankAccountsStore = useBankAccountsStore();
      const invoicesStore = useInvoicesStore();
      const taxesStore = useTaxesStore();

      await dataStore.migrate();

      clientsStore.terminate();
      bankAccountsStore.terminate();
      invoicesStore.terminate();
      taxesStore.terminate();

      await this.getTeam();

      clientsStore.init();
      bankAccountsStore.init();
      invoicesStore.init();
      taxesStore.init();
    },
    terminate() {
      this.item = null;
    },
    async getTeam() {
      const team = await TeamService.getTeam();
      this.item = team;
      return team;
    },
    updateTeamProps(props) {
      if (this.item && props) {
        Object.assign(this.item, props);
      }
    },
    async updateTeam(props) {
      if (props) {
        this.updateTeamProps(props);
      }
      return TeamService.updateTeam(this.item);
    },
  },
});

export { DEFAULT_CUSTOM_CSS };
