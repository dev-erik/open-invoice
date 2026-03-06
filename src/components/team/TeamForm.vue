<template>
    <div>
        <div class="row">
            <div class="col-12 d-flex justify-content-between">
                <h4>{{ $t('team-form:title') }}</h4>
                <div v-if="team">
                    <button class="btn btn-sm btn-primary"
                            @click="done">{{ $t('team-form:done') }}
                    </button>
                </div>
            </div>
        </div>
        <div class="row">
            <div v-if="team" class="col-12">
                <ul class="nav nav-tabs nav-tabs--simple mb-4 ms-n3" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" :class="{ active: activeTab === 'general' }"
                                @click="activeTab = 'general'" type="button" role="tab">
                            {{ $t('team-form:tabs.general') }}
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" :class="{ active: activeTab === 'invoicing' }"
                                @click="activeTab = 'invoicing'" type="button" role="tab">
                            {{ $t('team-form:tabs.invoicing') }}
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" :class="{ active: activeTab === 'address' }"
                                @click="activeTab = 'address'" type="button" role="tab">
                            {{ $t('team-form:tabs.address') }}
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" :class="{ active: activeTab === 'taxes' }"
                                @click="activeTab = 'taxes'" type="button" role="tab">
                            {{ $t('team-form:tabs.taxes') }}
                        </button>
                    </li>
                </ul>

                <div v-show="activeTab === 'general'">
                    <div class="row mb-2">
                        <div class="col-12">
                            <label>Logo</label>
                            <TeamLogo :errors="errors"/>
                        </div>
                    </div>
                    <div class="row">
                        <AppInput :modelValue="team.company_name" @change="updateProp({ company_name: $event })"
                                  :label="$t('team-form:general.company_name')" field="company_name" :errors="errors"
                                  class="col-12"/>
                        <AppInput :modelValue="team.contact_email" @change="updateProp({ contact_email: $event })"
                                  :label="$t('team-form:general.contact_email')" field="contact_email" :errors="errors"
                                  class="col-12"/>
                        <AppInput :modelValue="team.contact_phone" @change="updateProp({ contact_phone: $event })"
                                  :label="$t('team-form:general.contact_phone')" field="contact_phone" :errors="errors"
                                  class="col-12"/>
                        <AppInput :modelValue="team.website" @change="updateProp({ website: $event })"
                                  :label="$t('team-form:general.website')" field="website" :errors="errors" class="col-12"/>
                    </div>
                    <TeamFields class="row" :team="team"/>
                </div>

                <div v-show="activeTab === 'invoicing'">
                    <div class="row">
                        <AppInput :modelValue="team.invoice_late_fee" @change="updateProp({ invoice_late_fee: $event })"
                                  type="number"
                                  :label="$t('team-form:invoicing.invoice_late_fee')" field="invoice_late_fee" :errors="errors"
                                  class="col-12"/>
                        <AppInput :modelValue="team.invoice_due_days" @change="updateProp({ invoice_due_days: $event })"
                                  type="number"
                                  :label="$t('team-form:invoicing.invoice_due_days')" field="invoice_due_days" :errors="errors"
                                  class="col-sm-7"/>
                        <AppInput :modelValue="team.currency" @change="updateProp({ currency: $event })"
                                  :label="$t('team-form:invoicing.currency')" field="currency" :errors="errors" class="col-sm-5"/>
                        <AppInput :modelValue="team.vat_code" @change="updateProp({ vat_code: $event })"
                                  label="VAT / Tax ID" field="vat_code" :errors="errors"
                                  placeholder="e.g. EE123456789"
                                  class="col-12"/>
                    </div>
                </div>

                <div v-show="activeTab === 'address'">
                    <div class="row">
                        <AppInput :modelValue="team.company_address" @change="updateProp({ company_address: $event })"
                                  :label="$t('team-form:address.company_address')" field="company_address" :errors="errors"
                                  class="col-12"/>
                        <AppInput :modelValue="team.company_postal_code"
                                  @change="updateProp({ company_postal_code: $event })"
                                  :label="$t('team-form:address.company_postal_code')" field="company_postal_code"
                                  :errors="errors"
                                  class="col-sm-5"/>
                        <AppInput :modelValue="team.company_city" @change="updateProp({ company_city: $event })"
                                  :label="$t('team-form:address.company_city')" field="company_city" :errors="errors"
                                  class="col-sm-7"/>
                        <AppInput :modelValue="team.company_county" @change="updateProp({ company_county: $event })"
                                  :label="$t('team-form:address.company_county')" field="company_county" :errors="errors"
                                  class="col-sm-6"/>
                        <AppInput :modelValue="team.company_country" @change="updateProp({ company_country: $event })"
                                  :label="$t('team-form:address.company_country')" field="company_country" :errors="errors"
                                  class="col-sm-6"/>
                    </div>
                </div>

                <div v-show="activeTab === 'taxes'">
                    <TeamTaxes @changed="taxesChanged = true"/>
                </div>
            </div>
        </div>

        <div v-if="!team">{{ $t('team-form:loading') }}</div>
    </div>
</template>
<script>
import { useTeamsStore } from '@/store/teams';
import { useInvoiceRowsStore } from '@/store/invoice-rows';
import NotificationService from '@/services/notification.service';
import AppInput from '@/components/form/AppInput.vue';
import Errors from '@/utils/errors';
import TeamFields from '@/components/team/TeamFields.vue';
import TeamLogo from '@/components/team/TeamLogo.vue';
import TeamTaxes from '@/components/team/TeamTaxes.vue';

export default {
  components: {
    TeamLogo,
    TeamFields,
    TeamTaxes,
    AppInput,
  },
  emits: ['done'],
  data() {
    return {
      errors: new Errors(),
      loading: false,
      taxesChanged: false,
      activeTab: 'general',
    };
  },
  computed: {
    team() {
      return useTeamsStore().team;
    },
  },
  methods: {
    updateProp(props) {
      this.errors.clear();

      useTeamsStore().updateTeam(props)
        .then(() => {
          NotificationService.success(this.$t('team-form:updated'));
        })
        .catch(err => this.errors.set(err.errors));
    },
    async done() {
      if (this.taxesChanged) {
        await this.promptUpdateInvoiceRowTaxes();
      }
      this.$emit('done');
    },
    async promptUpdateInvoiceRowTaxes() {
      const confirmed = confirm(this.$t('team-form:tax_modal.title'));
      if (confirmed) {
        await useInvoiceRowsStore().overwriteTaxes();
        NotificationService.success(this.$t('team-form:tax_modal.taxes_updated'));
      }
    },
  },
};
</script>
