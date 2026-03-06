import { defineStore } from 'pinia';
import InvoiceService from '@/services/invoice.service';
import { generateInvoiceNumber, pick, uuidv4 } from '@/utils/helpers';
import dayjs from 'dayjs';
import Errors from '@/utils/errors';
import { useClientsStore } from '@/store/clients';
import { useTeamsStore } from '@/store/teams';
import { useInvoiceClientFieldsStore } from '@/store/invoice-client-fields';
import { useInvoiceTeamFieldsStore } from '@/store/invoice-team-fields';

function computeInvoiceTotals(invoice) {
  if (!invoice) return invoice;
  const rows = invoice.rows || [];

  const subTotal = rows.reduce((sum, row) => (row.quantity * row.price) + sum, 0);

  const taxesMap = {};
  rows.forEach(row => {
    (row.taxes || []).forEach(tax => {
      if (!Object.prototype.hasOwnProperty.call(taxesMap, tax.label)) {
        taxesMap[tax.label] = { total: 0, label: tax.label, rate: tax.value };
      }
      taxesMap[tax.label].total += (row.quantity * row.price) * tax.value / 100;
    });
  });

  const taxTotal = Object.values(taxesMap).reduce((sum, tax) => tax.total + sum, 0);

  return {
    ...invoice,
    subTotal,
    taxTotal,
    total: subTotal + taxTotal,
    taxes: taxesMap,
    rows: rows.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
  };
}

function resolveInvoice(invoice, clientsItems) {
  if (!invoice) return null;
  const client = invoice.client_id
    ? clientsItems.find(c => c.id === invoice.client_id) || null
    : null;
  return computeInvoiceTotals({ ...invoice, client });
}

export const useInvoicesStore = defineStore('invoices', {
  state: () => ({
    items: [],
    invoiceId: null,
    isCustomizationsModalOpen: false,
    errors: new Errors(),
  }),
  getters: {
    invoice(state) {
      const raw = state.items.find(i => i.id === state.invoiceId) || null;
      if (!raw) return null;
      const clientsStore = useClientsStore();
      return resolveInvoice(raw, clientsStore.items);
    },
    all(state) {
      const clientsStore = useClientsStore();
      return state.items
        .filter(i => !i._isNew)
        .map(i => resolveInvoice(i, clientsStore.items))
        .sort((a, b) => {
          const dateCompare = (b.issued_at || '').localeCompare(a.issued_at || '');
          if (dateCompare !== 0) return dateCompare;
          return (b.number || '').localeCompare(a.number || '');
        });
    },
  },
  actions: {
    async init() {
      return this.getInvoices();
    },
    terminate() {
      this.items = [];
    },
    async getInvoices() {
      const invoices = await InvoiceService.getInvoices();
      this.items = invoices || [];
      return invoices;
    },
    async getInvoice(invoiceId) {
      const invoice = await InvoiceService.getInvoice(invoiceId);
      const index = this.items.findIndex(i => i.id === invoice.id);
      if (index !== -1) {
        this.items[index] = { ...this.items[index], ...invoice };
      } else {
        this.items.push(invoice);
      }
      this.invoiceId = invoiceId;
      return invoice;
    },
    async createNewInvoice() {
      const invoice = {
        id: uuidv4(),
        number: '',
        status: 'draft',
        issued_at: '',
        is_compact: false,
        due_at: '',
        late_fee: '',
        currency: '',
        from_name: '',
        from_address: '',
        from_postal_code: '',
        from_city: '',
        from_country: '',
        from_county: '',
        from_website: '',
        from_email: '',
        from_phone: '',
        bank_name: '',
        bank_account_no: '',
        client_name: '',
        client_address: '',
        client_postal_code: '',
        client_country: '',
        client_county: '',
        client_city: '',
        client_email: '',
        client_id: null,
        rows: [],
        notes: '',
        updated_at: '',
        created_at: '',
        client_fields: [],
        team_fields: [],
        _isNew: true,
      };

      this.items.push(invoice);
      await InvoiceService.createInvoice({ ...invoice });
      await this.prefillInvoice({ invoiceId: invoice.id });
      await this.prefillTeam({ invoiceId: invoice.id });
      return invoice.id;
    },
    updateInvoiceProps(invoiceId, props) {
      const index = this.items.findIndex(i => i.id === invoiceId);
      if (index !== -1) {
        this.items[index] = { ...this.items[index], ...props };
      }
    },
    async _updateClient(payload) {
      const clientProps = pick(payload.props, {
        bank_account_id: 'bank_account_id',
        client_name: 'company_name',
        client_address: 'company_address',
        client_postal_code: 'company_postal_code',
        client_country: 'company_country',
        client_county: 'company_county',
        client_city: 'company_city',
        client_email: 'invoice_email',
        currency: 'currency',
      });

      const invoice = this.items.find(i => i.id === payload.invoiceId);
      if (Object.keys(clientProps).length > 0 && invoice && invoice.client_id) {
        const clientsStore = useClientsStore();
        clientsStore.updateClient({
          props: clientProps,
          clientId: invoice.client_id,
        });
      }
    },
    async _updateTeam(payload) {
      const teamProps = pick(payload.props, {
        late_fee: 'invoice_late_fee',
        from_name: 'company_name',
        from_address: 'company_address',
        from_postal_code: 'company_postal_code',
        from_city: 'company_city',
        from_country: 'company_country',
        from_county: 'company_county',
        from_website: 'website',
        from_email: 'contact_email',
        from_phone: 'contact_phone',
      });

      const invoice = this.items.find(i => i.id === payload.invoiceId);

      if ('due_at' in payload.props || 'issued_at' in payload.props) {
        if (invoice) {
          teamProps.invoice_due_days = dayjs(invoice.due_at)
            .diff(invoice.issued_at, 'days');
        }
      }

      if (Object.keys(teamProps).length > 0) {
        const teamsStore = useTeamsStore();
        teamsStore.updateTeam(teamProps);
      }
    },
    async updateInvoice(payload) {
      if (payload.props) {
        this.updateInvoiceProps(payload.invoiceId, payload.props);
        await this._updateClient(payload);
        await this._updateTeam(payload);
      }

      this.errors.clear();
      const invoice = this.items.find(i => i.id === payload.invoiceId);
      if (!invoice) return;

      const clientsStore = useClientsStore();
      const resolved = resolveInvoice(invoice, clientsStore.items);

      try {
        return await InvoiceService.updateInvoice(resolved);
      } catch (err) {
        this.errors.set(err.errors);
      }
    },
    async deleteInvoice(invoice) {
      const res = await InvoiceService.deleteInvoice(invoice.id);
      this.items = this.items.filter(i => i.id !== invoice.id);
      return res;
    },
    async bookInvoice() {
      this.errors.clear();

      try {
        const clientsStore = useClientsStore();
        const raw = this.items.find(i => i.id === this.invoiceId);
        const resolved = resolveInvoice(raw, clientsStore.items);
        await InvoiceService.bookInvoice(resolved);
        return this.getInvoice(this.invoiceId);
      } catch (err) {
        this.errors.set(err.errors);
      }
    },
    prefillClient(payload) {
      const client = payload.client;

      const invoiceClientFieldsStore = useInvoiceClientFieldsStore();
      invoiceClientFieldsStore.removeInvoiceClientFields(payload.invoiceId);

      (client.fields || []).forEach(field => {
        invoiceClientFieldsStore.addInvoiceClientField({
          invoiceId: payload.invoiceId,
          props: {
            label: field.label,
            value: field.value,
            client_field_id: field.id,
          },
        });
      });

      const teamsStore = useTeamsStore();
      const team = teamsStore.team;

      return this.updateInvoice({
        invoiceId: payload.invoiceId,
        props: {
          client_id: client.id,
          client_name: client.company_name,
          client_address: client.company_address,
          client_postal_code: client.company_postal_code,
          client_city: client.company_city,
          client_county: client.company_county,
          client_country: client.company_country,
          client_email: client.invoice_email,
          currency: client.currency || (team && team.currency) || 'USD',
          bank_name: client.bank_account ? client.bank_account.bank_name : null,
          bank_account_no: client.bank_account ? client.bank_account.account_no : null,
        },
      });
    },
    prefillInvoice(payload) {
      const teamsStore = useTeamsStore();
      const team = teamsStore.team;

      const props = {
        issued_at: dayjs().format('YYYY-MM-DD'),
        due_at: dayjs()
          .add((team && team.invoice_due_days) || 14, 'days')
          .format('YYYY-MM-DD'),
        number: generateInvoiceNumber(this.all),
        late_fee: (team && team.invoice_late_fee) || 0.5,
        currency: (team && team.currency) || 'USD',
      };

      return this.updateInvoice({
        invoiceId: payload.invoiceId,
        props,
      });
    },
    prefillTeam(payload) {
      const teamsStore = useTeamsStore();
      const invoiceTeamFieldsStore = useInvoiceTeamFieldsStore();
      const team = teamsStore.team;

      if (!team) return;

      invoiceTeamFieldsStore.removeInvoiceTeamFields(payload.invoiceId);

      (team.fields || []).forEach(field => {
        invoiceTeamFieldsStore.addInvoiceTeamField({
          invoiceId: payload.invoiceId,
          props: {
            label: field.label,
            value: field.value,
            team_field_id: field.id,
          },
        });
      });

      const props = {
        from_name: team.company_name,
        from_address: team.company_address,
        from_postal_code: team.company_postal_code,
        from_city: team.company_city,
        from_country: team.company_country,
        from_county: team.company_county,
        from_website: team.website,
        from_email: team.contact_email,
        from_phone: team.contact_phone,
      };

      return this.updateInvoice({
        invoiceId: payload.invoiceId,
        props,
      });
    },
  },
});
