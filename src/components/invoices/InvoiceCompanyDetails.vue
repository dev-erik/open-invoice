<template>
    <div>
        <strong class="break-line">
            <AppEditable :modelValue="invoice.from_name"
                         :errors="errors"
                         field="from_name"
                         :placeholder="$t('invoice-company-details:your_company_name')"
                         @change="updateProp({ from_name: $event })"/>
            <i class="material-icons md-18 ms-2 pointer d-print-none" @click="editTeam">edit</i>
        </strong>
        <AppEditable :modelValue="invoice.from_address"
                     suffix=", "
                     :placeholder="$t('invoice-company-details:address')"
                     @change="updateProp({ from_address: $event })"/>
        <AppEditable :modelValue="invoice.from_postal_code"
                     :placeholder="$t('invoice-company-details:postal_code')"
                     class="break-line"
                     @change="updateProp({ from_postal_code: $event })"/>
        <AppError :errors="errors" field="from_address"/>
        <AppError :errors="errors" field="from_postal_code"/>

        <AppEditable :modelValue="invoice.from_city"
                     suffix=", "
                     :placeholder="$t('invoice-company-details:city')"
                     @change="updateProp({ from_city: $event })"/>
        <AppEditable :modelValue="invoice.from_county"
                     suffix=", "
                     :placeholder="$t('invoice-company-details:county')"
                     @change="updateProp({ from_county: $event })"/>
        <AppEditable :modelValue="invoice.from_country"
                     :placeholder="$t('invoice-company-details:country')"
                     class="break-line"
                     @change="updateProp({ from_country: $event })"/>
        <AppError :errors="errors" field="from_city"/>
        <AppError :errors="errors" field="from_county"/>
        <AppError :errors="errors" field="from_country"/>

        <span :class="{'d-print-none': !invoice.from_vat_code}">
            <AppEditable :modelValue="invoice.from_vat_code"
                         field="from_vat_code"
                         :placeholder="$t('invoice-company-details:vat_code')"
                         class="break-line"
                         @change="updateProp({ from_vat_code: $event })"/>
        </span>

        <InvoiceTeamFields :invoice="invoice"/>

        <AppEditable :modelValue="invoice.from_email"
                     :errors="errors"
                     field="from_email"
                     :placeholder="$t('invoice-company-details:your_email')"
                     @change="updateProp({ from_email: $event })"/>
    </div>
</template>
<script>
import { useTeamsStore } from '@/store/teams';
import AppError from '@/components/form/AppError.vue';
import InvoiceTeamFields from '@/components/invoices/InvoiceTeamFields.vue';
import AppEditable from '@/components/form/AppEditable.vue';

export default {
  props: ['invoice', 'errors'],
  components: {
    AppEditable,
    AppError,
    InvoiceTeamFields,
  },
  setup() {
    const teamsStore = useTeamsStore();
    return { teamsStore };
  },
  methods: {
    updateProp(props) {
      this.$emit('update', props);
    },
    editTeam() {
      this.teamsStore.isModalOpen = true;
    },
  },
};
</script>
