import { defineStore } from 'pinia';
import ClientService from '@/services/client.service';
import { uuidv4 } from '@/utils/helpers';
import { useBankAccountsStore } from '@/store/bank-accounts';
import { useClientFieldsStore } from '@/store/client-fields';

export const useClientsStore = defineStore('clients', {
  state: () => ({
    items: [],
    clientId: null,
    isModalOpen: false,
  }),
  getters: {
    client(state) {
      const c = state.items.find(c => c.id === state.clientId) || null;
      if (!c) return null;
      const bankAccountsStore = useBankAccountsStore();
      return {
        ...c,
        bank_account: c.bank_account_id
          ? bankAccountsStore.items.find(a => a.id === c.bank_account_id) || null
          : null,
      };
    },
    all(state) {
      const bankAccountsStore = useBankAccountsStore();
      return state.items
        .filter(c => !c._isNew)
        .map(c => ({
          ...c,
          bank_account: c.bank_account_id
            ? bankAccountsStore.items.find(a => a.id === c.bank_account_id) || null
            : null,
        }));
    },
  },
  actions: {
    async init() {
      return this.getClients();
    },
    terminate() {
      this.items = [];
    },
    async getClients() {
      const clients = await ClientService.getClients();
      this.items = clients || [];
      return clients;
    },
    async getClient(clientId) {
      const client = await ClientService.getClient(clientId);
      this.clientId = client.id;
      const index = this.items.findIndex(c => c.id === client.id);
      if (index !== -1) {
        this.items[index] = { ...this.items[index], ...client };
      } else {
        this.items.push(client);
      }
    },
    async createNewClient(clientData) {
      let client = clientData;
      if (!client.id) {
        client = {
          id: uuidv4(),
          company_name: '',
          company_address: '',
          company_postal_code: '',
          company_country: '',
          company_county: '',
          company_city: '',
          has_tax: true,
          currency: null,
          rate: null,
          invoice_email: '',
          bank_account_id: null,
          fields: [],
          updated_at: '',
          created_at: '',
          ...clientData,
        };
      }

      const clientFieldsStore = useClientFieldsStore();
      clientFieldsStore.addAllFields(client.id);

      const res = await ClientService.createClient(client);
      const index = this.items.findIndex(c => c.id === res.id);
      if (index !== -1) {
        this.items[index] = { ...this.items[index], ...res, _isNew: false };
      } else {
        this.items.push(res);
      }

      const bankAccountsStore = useBankAccountsStore();
      const saved = this.items.find(c => c.id === res.id);
      return {
        ...saved,
        bank_account: saved.bank_account_id
          ? bankAccountsStore.items.find(a => a.id === saved.bank_account_id) || null
          : null,
      };
    },
    updateClientProps(clientId, props) {
      const index = this.items.findIndex(c => c.id === clientId);
      if (index !== -1) {
        this.items[index] = { ...this.items[index], ...props };
      }
    },
    async updateClient(payload) {
      if (payload.props) {
        this.updateClientProps(payload.clientId, payload.props);
      }
      const client = this.items.find(c => c.id === payload.clientId);
      if (client) {
        return ClientService.updateClient(client);
      }
    },
    openNewClientModal() {
      const client = {
        id: uuidv4(),
        company_name: '',
        company_address: '',
        company_postal_code: '',
        company_country: '',
        company_county: '',
        company_city: '',
        has_tax: true,
        currency: null,
        rate: null,
        invoice_email: '',
        bank_account_id: null,
        fields: [],
        updated_at: '',
        created_at: '',
        _isNew: true,
      };
      this.items.push(client);
      this.clientId = client.id;
      this.isModalOpen = true;
    },
    async deleteClient(clientId) {
      const res = await ClientService.deleteClient(clientId);
      this.items = this.items.filter(c => c.id !== clientId);
      return res;
    },
  },
});
