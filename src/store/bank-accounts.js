import { defineStore } from 'pinia';
import BankAccountService from '@/services/bank-account.service';
import { uuidv4 } from '@/utils/helpers';

export const useBankAccountsStore = defineStore('bankAccounts', {
  state: () => ({
    items: [],
    bankAccountId: null,
    isModalOpen: null,
  }),
  getters: {
    bankAccount(state) {
      return state.items.find(a => a.id === state.bankAccountId) || null;
    },
    all(state) {
      return state.items.filter(a => !a._isNew);
    },
  },
  actions: {
    async init() {
      return this.getBankAccounts();
    },
    terminate() {
      this.items = [];
    },
    async getBankAccounts() {
      const accounts = await BankAccountService.getBankAccounts();
      this.items = accounts || [];
      return accounts;
    },
    async getBankAccount(bankAccountId) {
      const bankAccount = await BankAccountService.getBankAccount(bankAccountId);
      this.bankAccountId = bankAccount.id;
      const index = this.items.findIndex(a => a.id === bankAccount.id);
      if (index !== -1) {
        this.items[index] = { ...this.items[index], ...bankAccount };
      } else {
        this.items.push(bankAccount);
      }
      return bankAccount;
    },
    async createNewBankAccount(bankAccount) {
      const res = await BankAccountService.createBankAccount(bankAccount);
      const index = this.items.findIndex(a => a.id === res.id);
      if (index !== -1) {
        this.items[index] = { ...this.items[index], ...res, _isNew: false };
      } else {
        this.items.push(res);
      }
      return this.items.find(a => a.id === res.id);
    },
    updateBankAccountProps(props) {
      const index = this.items.findIndex(a => a.id === this.bankAccountId);
      if (index !== -1) {
        this.items[index] = { ...this.items[index], ...props };
      }
    },
    async updateBankAccount(props) {
      this.updateBankAccountProps(props);
      return BankAccountService.updateBankAccount(this.bankAccount);
    },
    openNewBankAccountModal() {
      const bankAccount = {
        id: uuidv4(),
        bank_name: '',
        account_no: '',
        updated_at: '',
        created_at: '',
        _isNew: true,
      };
      this.items.push(bankAccount);
      this.bankAccountId = bankAccount.id;
      this.isModalOpen = true;
    },
  },
});
