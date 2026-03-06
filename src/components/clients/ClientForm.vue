<template>
    <div>
        <div class="row">
            <div class="col-12 d-flex justify-content-between">
                <h4>{{ $t('client-form:title') }}</h4>
                <div v-if="client">
                    <div v-if="!isNew">
                        <div class="dropdown d-inline-block">
                            <button class="btn btn-sm btn-link" type="button"
                                    data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="material-icons">more_vert</i>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li>
                                    <button class="dropdown-item" @click="deleteClient">
                                        {{ $t('client-form:delete') }}
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <button class="btn btn-sm btn-primary"
                                @click="$emit('done')">{{ $t('client-form:done') }}
                        </button>
                    </div>
                    <button v-else class="btn btn-primary ms-2"
                            :disabled="loading"
                            @click="createClient">{{ $t('client-form:create') }}
                    </button>
                </div>
            </div>
        </div>

        <div v-if="client">
            <ul class="nav nav-tabs nav-tabs--simple mb-4" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link" :class="{ active: activeTab === 'general' }"
                            @click="activeTab = 'general'" type="button" role="tab">
                        {{ $t('client-form:tabs.general') }}
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" :class="{ active: activeTab === 'invoicing' }"
                            @click="activeTab = 'invoicing'" type="button" role="tab">
                        {{ $t('client-form:tabs.invoicing') }}
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" :class="{ active: activeTab === 'address' }"
                            @click="activeTab = 'address'" type="button" role="tab">
                        {{ $t('client-form:tabs.address') }}
                    </button>
                </li>
            </ul>

            <div v-show="activeTab === 'general'" class="row">
                <div class="row">
                    <AppInput :value="client.company_name" @change="updateProp({ company_name: $event })"
                              :label="$t('client-form:general.company_name')" field="company_name" :errors="errors" class="col-12"/>
                    <AppInput :value="client.invoice_email" @change="updateProp({ invoice_email: $event })"
                              :label="$t('client-form:general.invoice_email')" field="invoice_email" :errors="errors"
                              class="col-sm-7"/>
                </div>
                <ClientFields class="row" :client="client"/>
            </div>

            <div v-show="activeTab === 'invoicing'" class="row">
                <div class="row">
                    <AppInput :value="client.currency" @change="updateProp({ currency: $event })"
                              :label="$t('client-form:invoicing.currency')" field="currency" :errors="errors" class="col-sm-4"/>
                    <AppInput :value="client.rate" @change="updateProp({ rate: $event })"
                              :label="$t('client-form:invoicing.rate')" field="rate" :errors="errors" class="col-sm-4"/>
                    <AppCheckbox :value="client.has_tax" @input="updateProp({ has_tax: $event })"
                                 :label="$t('client-form:invoicing.has_tax')" field="has_tax" :errors="errors" class="col-sm-4"/>
                    <AppSelect :value="client.bank_account"
                               track-by="id"
                               :label="$t('client-form:invoicing.bank_account')"
                               label-field="bank_name"
                               :options="bankAccounts || []"
                               @input="bankAccountChanged"
                               class="col-12"/>
                </div>
            </div>

            <div v-show="activeTab === 'address'" class="row">
                <div class="row">
                    <AppInput :value="client.company_address" @change="updateProp({ company_address: $event })"
                              :label="$t('client-form:address.company_address')" field="company_address" :errors="errors"
                              class="col-12"/>
                    <AppInput :value="client.company_postal_code"
                              @change="updateProp({ company_postal_code: $event })"
                              :label="$t('client-form:address.company_postal_code')" field="company_postal_code" :errors="errors"
                              class="col-sm-5"/>
                    <AppInput :value="client.company_city" @change="updateProp({ company_city: $event })"
                              :label="$t('client-form:address.company_city')" field="company_city" :errors="errors"
                              class="col-sm-7"/>
                    <AppInput :value="client.company_county" @change="updateProp({ company_county: $event })"
                              :label="$t('client-form:address.company_county')" field="company_county" :errors="errors"
                              class="col-sm-6"/>
                    <AppInput :value="client.company_country" @change="updateProp({ company_country: $event })"
                              :label="$t('client-form:address.company_country')" field="company_country" :errors="errors"
                              class="col-sm-6"/>
                </div>
            </div>
        </div>

        <div v-if="!client">{{ $t('client-form:loading') }}</div>
    </div>
</template>
<script>
import { useClientsStore } from '@/store/clients';
import { useBankAccountsStore } from '@/store/bank-accounts';
import NotificationService from '@/services/notification.service';
import AppInput from '@/components/form/AppInput.vue';
import AppSelect from '@/components/form/AppSelect.vue';
import Errors from '@/utils/errors';
import AppCheckbox from '@/components/form/AppCheckbox.vue';
import ClientFields from '@/components/clients/ClientFields.vue';

export default {
  components: {
    ClientFields,
    AppCheckbox,
    AppInput,
    AppSelect,
  },
  emits: ['done'],
  data() {
    return {
      errors: new Errors(),
      loading: false,
      activeTab: 'general',
    };
  },
  computed: {
    client() {
      return useClientsStore().client;
    },
    bankAccounts() {
      return useBankAccountsStore().all;
    },
    isNew() {
      return this.client && this.client._isNew;
    },
  },
  mounted() {
    this.getBankAccounts();
  },
  methods: {
    getBankAccounts() {
      useBankAccountsStore().getBankAccounts();
    },
    updateProp(props) {
      const clientsStore = useClientsStore();
      if (this.isNew) {
        return clientsStore.updateClientProps(this.client.id, props);
      }
      this.errors.clear();

      clientsStore.updateClient({
        props,
        clientId: this.client.id,
      })
        .then(() => {
          NotificationService.success(this.$t('client-form:notification_updated'));
        })
        .catch(err => this.errors.set(err.errors));
    },
    bankAccountChanged(val) {
      this.updateProp({
        bank_account_id: val ? val.id : null,
        bank_account: val,
      });
    },
    createClient() {
      this.loading = true;
      this.errors.clear();

      return useClientsStore().createNewClient(this.client)
        .then((client) => {
          this.$router.push({
            query: {
              clientId: client.id,
            },
          });
          this.$emit('done');
        })
        .catch(err => this.errors.set(err.errors))
        .finally(() => {
          this.loading = false;
        });
    },
    async deleteClient() {
      const confirmed = confirm(`${this.$t('client-form:delete_modal.title')} ${this.client.company_name}?`);
      if (confirmed) {
        this.$emit('done');
        await useClientsStore().deleteClient(this.client.id);
        try {
          NotificationService.success(this.$t('client-form:notification_deleted'));
        } catch (err) {
          NotificationService.error(err.message);
        }
      }
    },
  },
};
</script>
