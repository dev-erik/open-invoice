import { defineStore } from 'pinia';
import { uuidv4 } from '@/utils/helpers';
import { useClientsStore } from '@/store/clients';

export const useClientFieldsStore = defineStore('clientFields', {
  actions: {
    init() {},
    terminate() {},
    updateClientFieldProps(fieldId, props) {
      const clientsStore = useClientsStore();
      for (const client of clientsStore.items) {
        if (!client.fields) continue;
        const index = client.fields.findIndex(f => f.id === fieldId);
        if (index !== -1) {
          client.fields[index] = { ...client.fields[index], ...props };
          return client.fields[index];
        }
      }
      return null;
    },
    async updateClientField(payload) {
      const field = this.updateClientFieldProps(payload.fieldId, payload.props);
      if (!field) return;
      const clientsStore = useClientsStore();
      return clientsStore.updateClient({ clientId: field.client_id });
    },
    addNewField(clientId) {
      const clientsStore = useClientsStore();
      const client = clientsStore.items.find(c => c.id === clientId);
      if (!client) return;
      if (!client.fields) client.fields = [];
      client.fields.push({
        id: uuidv4(),
        client_id: clientId,
        label: '',
        value: '',
      });
    },
    addAllFields(clientId) {
      const clientsStore = useClientsStore();
      const client = clientsStore.items.find(c => c.id === clientId);
      if (!client) return;
      if (!client.fields) client.fields = [];

      const uniqueLabels = [];
      for (const c of clientsStore.items) {
        if (!c.fields) continue;
        for (const f of c.fields) {
          if (f.label && !uniqueLabels.includes(f.label)) {
            uniqueLabels.push(f.label);
          }
        }
      }

      uniqueLabels.forEach(label => {
        client.fields.push({
          id: uuidv4(),
          client_id: clientId,
          label,
          value: '',
        });
      });
    },
    async deleteClientField(fieldId) {
      const clientsStore = useClientsStore();
      let clientId = null;
      for (const client of clientsStore.items) {
        if (!client.fields) continue;
        const index = client.fields.findIndex(f => f.id === fieldId);
        if (index !== -1) {
          clientId = client.id;
          client.fields.splice(index, 1);
          break;
        }
      }
      if (clientId) {
        return clientsStore.updateClient({ clientId });
      }
    },
  },
});
