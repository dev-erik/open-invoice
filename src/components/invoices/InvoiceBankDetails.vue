<template>
    <div>
        <strong>
            <AppEditable :modelValue="invoice.bank_name"
                         :errors="errors"
                         :disabled="true"
                         field="bank_name"
                         :placeholder="$t('invoice-bank-details:bank_name')"
                         class="break-line"
                         @click="showBankModal = true"/>
        </strong>
        <AppEditable :modelValue="invoice.bank_account_no"
                     :errors="errors"
                     :disabled="true"
                     field="bank_account_no"
                     :placeholder="$t('invoice-bank-details:bank_account_no')"
                     class="break-line"
                     @click="showBankModal = true"/>
        <div v-if="showBankModal" class="modal d-block" tabindex="-1" @click.self="showBankModal = false">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content bg-base dp--24">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ $t('invoice-bank-details:bank_account_modal_title') }}</h5>
                        <button type="button" class="btn-close" @click="showBankModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <BankAccountsList @select="accountSelected"/>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="showBankModal" class="modal-backdrop fade show"></div>
    </div>
</template>
<script>
import BankAccountsList from '@/components/bank-accounts/BankAccountsList.vue';
import AppEditable from '@/components/form/AppEditable.vue';

export default {
  props: ['invoice', 'errors'],
  components: {
    AppEditable,
    BankAccountsList,
  },
  data() {
    return {
      showBankModal: false,
    };
  },
  methods: {
    accountSelected(account) {
      this.$emit('update', {
        bank_account_no: account.account_no,
        bank_name: account.bank_name,
        bank_account_id: account.id,
      });
      this.showBankModal = false;
    },
  },
};
</script>
