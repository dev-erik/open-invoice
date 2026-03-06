import { defineStore } from 'pinia';
import { uuidv4 } from '@/utils/helpers';
import { flatten, uniqBy } from 'lodash';
import { useInvoicesStore } from '@/store/invoices';
import { useTaxesStore } from '@/store/taxes';
import { useClientsStore } from '@/store/clients';
import { findVatRate } from '@/data/vat-rates';

export const useInvoiceRowsStore = defineStore('invoiceRows', {
  getters: {
    taxes() {
      const invoicesStore = useInvoicesStore();
      const invoice = invoicesStore.invoice;
      if (!invoice || !invoice.rows) return [];
      let taxes = invoice.rows.map(row => row.taxes || []);
      taxes = flatten(taxes);
      taxes = uniqBy(taxes, 'label');
      taxes = taxes.filter(tax => !!tax.label);
      return taxes;
    },
  },
  actions: {
    init() {},
    terminate() {},
    updateInvoiceRowProps(rowId, props) {
      const invoicesStore = useInvoicesStore();
      for (const invoice of invoicesStore.items) {
        if (!invoice.rows) continue;
        const index = invoice.rows.findIndex(r => r.id === rowId);
        if (index !== -1) {
          invoice.rows[index] = { ...invoice.rows[index], ...props };
          return;
        }
      }
    },
    async updateInvoiceRow(payload) {
      this.updateInvoiceRowProps(payload.id, payload.props);
      const invoicesStore = useInvoicesStore();
      return invoicesStore.updateInvoice({ invoiceId: payload.invoiceId });
    },
    addRow(invoiceId) {
      const invoicesStore = useInvoicesStore();
      const taxesStore = useTaxesStore();

      const invoice = invoicesStore.items.find(i => i.id === invoiceId);
      if (!invoice) return;
      if (!invoice.rows) invoice.rows = [];

      const rowId = uuidv4();
      const rowCount = invoice.rows.length;

      const taxes = [];
      const client = invoice.client_id
        ? (() => {
            const clientsStore = useClientsStore();
            return clientsStore.items.find(c => c.id === invoice.client_id) || null;
          })()
        : null;

      if ((client && client.has_tax) || !client) {
        const existingTaxes = this.taxes;
        const taxSource = existingTaxes.length > 0
          ? existingTaxes
          : taxesStore.allWithLabels;

        taxSource.forEach(tax => {
          taxes.push({
            id: uuidv4(),
            row_id: rowId,
            label: tax.label,
            value: tax.value,
          });
        });
      }

      if (invoice.vat_rate && invoice.vat_country) {
        const VAT_LABELS = ['VAT', 'GST', 'Consumption Tax', 'Sales Tax'];
        const hasVat = taxes.some(t => VAT_LABELS.includes(t.label));
        if (!hasVat) {
          const vatEntry = findVatRate(invoice.vat_country);
          if (vatEntry) {
            taxes.push({
              id: uuidv4(),
              row_id: rowId,
              label: vatEntry.taxName,
              value: vatEntry.rate,
            });
          }
        }
      }

      invoice.rows.push({
        id: rowId,
        invoice_id: invoiceId,
        item: '',
        quantity: null,
        price: null,
        unit: '',
        order: rowCount,
        taxes,
        updated_at: '',
        created_at: '',
      });
    },
    overwriteTaxes() {
      const invoicesStore = useInvoicesStore();
      const taxesStore = useTaxesStore();

      const invoice = invoicesStore.items.find(i => i.id === invoicesStore.invoiceId);
      if (!invoice || !invoice.rows) return;

      const taxes = taxesStore.allWithLabels;

      invoice.rows.forEach(row => {
        row.taxes = taxes.map(tax => ({
          id: uuidv4(),
          row_id: row.id,
          label: tax.label,
          value: tax.value,
        }));
      });
    },
    setVatOnAllRows(invoiceId, taxName, rate) {
      const invoicesStore = useInvoicesStore();
      const invoice = invoicesStore.items.find(i => i.id === invoiceId);
      if (!invoice || !invoice.rows) return;

      const VAT_LABELS = ['VAT', 'GST', 'Consumption Tax', 'Sales Tax'];

      invoice.rows.forEach(row => {
        if (!row.taxes) row.taxes = [];
        row.taxes = row.taxes.filter(t => !VAT_LABELS.includes(t.label));

        if (taxName && rate) {
          row.taxes.push({
            id: uuidv4(),
            row_id: row.id,
            label: taxName,
            value: rate,
          });
        }
      });
    },
    removeRow(invoiceId, rowId) {
      const invoicesStore = useInvoicesStore();
      const invoice = invoicesStore.items.find(i => i.id === invoiceId);
      if (invoice && invoice.rows) {
        invoice.rows = invoice.rows.filter(r => r.id !== rowId);
      }
    },
    updateInvoiceRowTaxProps(taxId, props) {
      const invoicesStore = useInvoicesStore();
      for (const invoice of invoicesStore.items) {
        if (!invoice.rows) continue;
        for (const row of invoice.rows) {
          if (!row.taxes) continue;
          const index = row.taxes.findIndex(t => t.id === taxId);
          if (index !== -1) {
            row.taxes[index] = { ...row.taxes[index], ...props };
            return;
          }
        }
      }
    },
    async updateInvoiceRowTax(payload) {
      this.updateInvoiceRowTaxProps(payload.taxId, payload.props);
      const invoicesStore = useInvoicesStore();
      return invoicesStore.updateInvoice({ invoiceId: payload.invoiceId });
    },
  },
});
