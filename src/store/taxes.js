import { defineStore } from 'pinia';
import TaxService from '@/services/tax.service';
import { uuidv4 } from '@/utils/helpers';

export const useTaxesStore = defineStore('taxes', {
  state: () => ({
    items: [],
  }),
  getters: {
    all(state) {
      return state.items;
    },
    allWithLabels(state) {
      return state.items.filter(tax => !!tax.label);
    },
  },
  actions: {
    async init() {
      return this.getTaxes();
    },
    terminate() {
      this.items = [];
    },
    async getTaxes() {
      const taxes = await TaxService.getTaxes();
      this.items = taxes || [];
      return taxes;
    },
    updateTaxProps(taxId, props) {
      const index = this.items.findIndex(t => t.id === taxId);
      if (index !== -1) {
        this.items[index] = { ...this.items[index], ...props };
      }
      return this.items[index] || null;
    },
    async updateTax(payload) {
      const tax = this.updateTaxProps(payload.taxId, payload.props);
      return TaxService.updateTax(tax);
    },
    async addNewTax() {
      const tax = {
        id: uuidv4(),
        label: '',
        value: '',
      };
      this.items.push(tax);
      return TaxService.createTax(tax);
    },
    async deleteTax(taxId) {
      this.items = this.items.filter(t => t.id !== taxId);
      return TaxService.deleteTax(taxId);
    },
  },
});
