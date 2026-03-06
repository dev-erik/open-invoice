<template>
    <div>
        <div v-if="!bankAccounts">{{ $t('bank-accounts-list:loading') }}</div>
        <div v-else-if="bankAccounts && bankAccounts.length > 0">
            <table class="table table-hover">
                <thead>
                <tr>
                    <th>{{ $t('bank-accounts-list:bank') }}</th>
                    <th>{{ $t('bank-accounts-list:bank_account_details') }}</th>
                    <th class="text-end"></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="account in bankAccounts" :key="account.id"
                    @click="onSelect(account)" :class="{pointer: hasSelectListener }">
                    <td>{{ account.bank_name }}</td>
                    <td>{{ account.account_no }}</td>
                    <td class="text-end">
                        <i class="material-icons md-18 p-1 pointer"
                           @click.stop="openBankAccountModal(account)">
                            edit
                        </i>
                    </td>
                </tr>
                </tbody>
            </table>
            <button class="btn btn-sm btn-link" @click="createNewAccount">{{ $t('bank-accounts-list:add_bank_account') }}</button>
        </div>
        <EmptyState v-else>
            <template v-slot>
                <button class="btn btn-sm btn-link" @click="createNewAccount">{{ $t('bank-accounts-list:add_bank_account') }}</button>
            </template>
        </EmptyState>
    </div>
</template>
<script>
import { useBankAccountsStore } from '@/store/bank-accounts';
import EmptyState from '@/components/EmptyState.vue';

export default {
  components: {
    EmptyState,
  },
  emits: ['select'],
  props: {
    hasSelectListener: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    bankAccounts() {
      return useBankAccountsStore().all;
    },
  },
  mounted() {
    useBankAccountsStore().getBankAccounts();
  },
  methods: {
    createNewAccount() {
      useBankAccountsStore().openNewBankAccountModal();
    },
    openBankAccountModal(bankAccount) {
      const store = useBankAccountsStore();
      store.bankAccountId = bankAccount.id;
      this.$router.push({
        query: {
          bankAccountId: bankAccount.id,
        },
      });
    },
    onSelect(account) {
      this.$emit('select', account);
    },
  },
};
</script>
