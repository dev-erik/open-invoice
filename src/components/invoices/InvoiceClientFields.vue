<template>
    <div>
        <div v-for="field in invoice.client_fields" :key="field.id">
            <span :class="{'d-print-none': !field.value }">{{ field.label }}: </span>
            <AppEditable :modelValue="field.value"
                         :placeholder="field.label"
                         class="break-line"
                         @change="updateProp({ value: $event }, field)"/>
        </div>
    </div>
</template>
<script>
import { useInvoiceClientFieldsStore } from '@/store/invoice-client-fields';
import { useClientFieldsStore } from '@/store/client-fields';
import AppEditable from '@/components/form/AppEditable.vue';

export default {
  props: ['invoice'],
  components: {
    AppEditable,
  },
  setup() {
    const invoiceClientFieldsStore = useInvoiceClientFieldsStore();
    const clientFieldsStore = useClientFieldsStore();
    return { invoiceClientFieldsStore, clientFieldsStore };
  },
  methods: {
    updateProp(props, field) {
      this.invoiceClientFieldsStore.updateInvoiceClientField({
        props,
        fieldId: field.id,
        invoiceId: this.invoice.id,
      });
      this.clientFieldsStore.updateClientField({
        fieldId: field.client_field_id,
        props,
      });
    },
  },
};
</script>
