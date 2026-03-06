<template>
    <teleport to="body">
        <div v-if="isOpen" class="modal d-block" tabindex="-1" @click.self="close">
            <div class="modal-dialog modal-dialog-centered modal-md">
                <div class="modal-content bg-base dp--24">
                    <BankAccountForm @done="close()"/>
                </div>
            </div>
        </div>
        <div v-if="isOpen" class="modal-backdrop fade show"></div>
    </teleport>
</template>

<script>
import { useBankAccountsStore } from '@/store/bank-accounts';
import BankAccountForm from '@/components/bank-accounts/BankAccountForm.vue';

export default {
  components: {
    BankAccountForm,
  },
  computed: {
    isOpen() {
      return useBankAccountsStore().isModalOpen;
    },
    bankAccount() {
      return useBankAccountsStore().bankAccount;
    },
  },
  watch: {
    '$route.query.bankAccountId'() {
      this.getBankAccount();
    },
  },
  mounted() {
    this.getBankAccount();
  },
  methods: {
    getBankAccount() {
      const store = useBankAccountsStore();
      const query = this.$route.query;
      if (Object.prototype.hasOwnProperty.call(query, 'bankAccountId')) {
        if ((this.bankAccount && this.bankAccount.id !== query.bankAccountId) || !this.bankAccount) {
          store.getBankAccount(query.bankAccountId);
        }
        store.isModalOpen = true;
      } else {
        store.isModalOpen = false;
      }
    },
    close() {
      const store = useBankAccountsStore();
      this.$router.push({ query: {} });
      store.getBankAccounts();
      store.isModalOpen = false;
    },
  },
};
</script>
