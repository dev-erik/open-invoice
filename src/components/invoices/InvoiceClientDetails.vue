<template>
    <div>
        <div>
            <ClientSelector :value="invoice.client_name" btn-class="font-weight-bold" @selected="clientSelected"/>
            <i class="material-icons md-18 ms-2 pointer d-print-none" v-if="invoice.client" @click="editClient">edit</i>
        </div>
        <AppEditable :value="invoice.client_address"
                     suffix=", "
                     :placeholder="$t('invoice-client-details:client_address')"
                     @change="updateProp({ client_address: $event })"/>
        <AppEditable :value="invoice.client_postal_code"
                     :placeholder="$t('invoice-client-details:client_postal_code')"
                     class="break-line"
                     @change="updateProp({ client_postal_code: $event })"/>
        <AppError :errors="errors" field="client_address"/>
        <AppError :errors="errors" field="client_postal_code"/>

        <AppEditable :value="invoice.client_city"
                     suffix=", "
                     :placeholder="$t('invoice-client-details:client_city')"
                     @change="updateProp({ client_city: $event })"/>
        <AppEditable :value="invoice.client_county"
                     suffix=", "
                     :placeholder="$t('invoice-client-details:client_county')"
                     @change="updateProp({ client_county: $event })"/>
        <AppEditable :value="invoice.client_country"
                     :placeholder="$t('invoice-client-details:client_country')"
                     class="break-line"
                     @change="updateProp({ client_country: $event })"/>
        <AppError :errors="errors" field="client_city"/>
        <AppError :errors="errors" field="client_county"/>
        <AppError :errors="errors" field="client_country"/>

        <InvoiceClientFields :invoice="invoice"/>

        <AppEditable :value="invoice.client_email"
                     :errors="errors"
                     field="client_email"
                     class="break-line"
                     :placeholder="$t('invoice-client-details:client_email')"
                     @change="updateProp({ client_email: $event })"/>
    </div>
</template>
<script>
import { useInvoicesStore } from '@/store/invoices';
import AppError from '@/components/form/AppError.vue';
import AppEditable from '@/components/form/AppEditable.vue';
import ClientSelector from '@/components/clients/ClientSelector.vue';
import InvoiceClientFields from '@/components/invoices/InvoiceClientFields.vue';

export default {
  props: ['invoice', 'errors'],
  components: {
    AppError,
    ClientSelector,
    AppEditable,
    InvoiceClientFields,
  },
  setup() {
    const invoicesStore = useInvoicesStore();
    return { invoicesStore };
  },
  methods: {
    editClient() {
      this.$router.push({ query: { clientId: this.invoice.client_id } });
    },
    updateProp(props) {
      this.$emit('update', props);
    },
    clientSelected(client) {
      this.invoicesStore.prefillClient({
        client,
        invoiceId: this.invoice.id,
      });
    },
  },
};
</script>
