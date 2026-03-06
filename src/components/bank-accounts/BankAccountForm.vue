<template>
    <div>
        <div class="row">
            <div class="col-12">
                <h4>{{ $t('bank-account-form:title') }}</h4>
            </div>
        </div>
        <div v-if="bankAccount" class="row">
            <AppInput :modelValue="bankAccount.bank_name"
                      @change="updateProp({ bank_name: $event })"
                      :label="$t('bank-account-form:bank_name')"
                      field="bank_name"
                      :errors="errors"
                      class="col-sm-10"/>
            <AppTextarea :modelValue="bankAccount.account_no"
                         @change="updateProp({ account_no: $event })"
                         :label="$t('bank-account-form:account_no')"
                         field="account_no"
                         :errors="errors"
                         class="col-12"/>
        </div>

        <div v-else class="row">
            <div class="col-12 pt-3">
                <p>{{ $t('bank-account-form:loading') }} ..</p>
            </div>
        </div>

        <div class="row mt-3 text-end">
            <div class="col-12">
                <button v-if="!isNew" class="btn btn-primary"
                        @click="$emit('done')">{{ $t('bank-account-form:done') }}
                </button>
                <button v-if="isNew" class="btn btn-primary ms-2"
                        :disabled="loading"
                        @click="createBankAccount">{{ $t('bank-account-form:create') }}
                </button>
            </div>
        </div>
    </div>
</template>
<script>
import { useBankAccountsStore } from '@/store/bank-accounts';
import NotificationService from '@/services/notification.service';
import AppInput from '@/components/form/AppInput.vue';
import AppTextarea from '@/components/form/AppTextarea.vue';
import Errors from '@/utils/errors';

export default {
  components: {
    AppInput,
    AppTextarea,
  },
  emits: ['done'],
  data() {
    return {
      errors: new Errors(),
      loading: false,
    };
  },
  computed: {
    bankAccount() {
      return useBankAccountsStore().bankAccount;
    },
    isNew() {
      return this.bankAccount && this.bankAccount._isNew;
    },
  },
  methods: {
    updateProp(props) {
      const store = useBankAccountsStore();
      if (this.isNew) {
        return store.updateBankAccountProps(props);
      }
      this.errors.clear();

      return store.updateBankAccount(props)
        .then(() => {
          NotificationService.success(this.$t('bank-account-form:notification_updated'));
        })
        .catch(err => this.errors.set(err.errors));
    },
    createBankAccount() {
      this.loading = true;
      this.errors.clear();

      return useBankAccountsStore().createNewBankAccount(this.bankAccount)
        .then((bankAccount) => {
          this.$router.push({
            query: {
              bankAccountId: bankAccount.id,
            },
          });
          this.$emit('done');
        })
        .catch(err => this.errors.set(err.errors))
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>
