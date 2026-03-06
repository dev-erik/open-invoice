import { defineStore } from 'pinia';
import { uuidv4 } from '@/utils/helpers';
import { useInvoicesStore } from '@/store/invoices';

export const useInvoiceTeamFieldsStore = defineStore('invoiceTeamFields', {
  actions: {
    init() {},
    terminate() {},
    updateInvoiceTeamFieldProps(fieldId, props) {
      const invoicesStore = useInvoicesStore();
      for (const invoice of invoicesStore.items) {
        if (!invoice.team_fields) continue;
        const index = invoice.team_fields.findIndex(f => f.id === fieldId);
        if (index !== -1) {
          invoice.team_fields[index] = { ...invoice.team_fields[index], ...props };
          return invoice.team_fields[index];
        }
      }
      return null;
    },
    async updateInvoiceTeamField(payload) {
      this.updateInvoiceTeamFieldProps(payload.fieldId, payload.props);
      const invoicesStore = useInvoicesStore();
      return invoicesStore.updateInvoice({ invoiceId: payload.invoiceId });
    },
    addInvoiceTeamField(payload) {
      const invoicesStore = useInvoicesStore();
      const invoice = invoicesStore.items.find(i => i.id === payload.invoiceId);
      if (!invoice) return;
      if (!invoice.team_fields) invoice.team_fields = [];
      invoice.team_fields.push({
        id: uuidv4(),
        invoice_id: payload.invoiceId,
        ...payload.props,
      });
    },
    removeInvoiceTeamFields(invoiceId) {
      const invoicesStore = useInvoicesStore();
      const invoice = invoicesStore.items.find(i => i.id === invoiceId);
      if (invoice) {
        invoice.team_fields = [];
      }
    },
    removeInvoiceTeamField(fieldId) {
      const invoicesStore = useInvoicesStore();
      for (const invoice of invoicesStore.items) {
        if (!invoice.team_fields) continue;
        const index = invoice.team_fields.findIndex(f => f.id === fieldId);
        if (index !== -1) {
          invoice.team_fields.splice(index, 1);
          return;
        }
      }
    },
  },
});
