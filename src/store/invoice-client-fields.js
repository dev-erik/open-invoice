import { defineStore } from 'pinia';
import { uuidv4 } from '@/utils/helpers';
import { useInvoicesStore } from '@/store/invoices';

export const useInvoiceClientFieldsStore = defineStore('invoiceClientFields', {
  actions: {
    init() {},
    terminate() {},
    updateInvoiceClientFieldProps(fieldId, props) {
      const invoicesStore = useInvoicesStore();
      for (const invoice of invoicesStore.items) {
        if (!invoice.client_fields) continue;
        const index = invoice.client_fields.findIndex(f => f.id === fieldId);
        if (index !== -1) {
          invoice.client_fields[index] = { ...invoice.client_fields[index], ...props };
          return invoice.client_fields[index];
        }
      }
      return null;
    },
    async updateInvoiceClientField(payload) {
      this.updateInvoiceClientFieldProps(payload.fieldId, payload.props);
      const invoicesStore = useInvoicesStore();
      return invoicesStore.updateInvoice({ invoiceId: payload.invoiceId });
    },
    removeInvoiceClientFields(invoiceId) {
      const invoicesStore = useInvoicesStore();
      const invoice = invoicesStore.items.find(i => i.id === invoiceId);
      if (invoice) {
        invoice.client_fields = [];
      }
    },
    addInvoiceClientField(payload) {
      const invoicesStore = useInvoicesStore();
      const invoice = invoicesStore.items.find(i => i.id === payload.invoiceId);
      if (!invoice) return;
      if (!invoice.client_fields) invoice.client_fields = [];
      invoice.client_fields.push({
        id: uuidv4(),
        invoice_id: payload.invoiceId,
        ...payload.props,
      });
    },
    removeInvoiceClientField(fieldId) {
      const invoicesStore = useInvoicesStore();
      for (const invoice of invoicesStore.items) {
        if (!invoice.client_fields) continue;
        const index = invoice.client_fields.findIndex(f => f.id === fieldId);
        if (index !== -1) {
          invoice.client_fields.splice(index, 1);
          return;
        }
      }
    },
  },
});
