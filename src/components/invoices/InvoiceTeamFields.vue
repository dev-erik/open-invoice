<template>
    <div>
        <div v-for="field in invoice.team_fields" :key="field.id">
            <span :class="{'d-print-none': !field.value }">{{ field.label }}: </span>
            <AppEditable :modelValue="field.value"
                         :placeholder="field.label"
                         class="break-line"
                         @change="updateProp({ value: $event }, field)"/>
        </div>
    </div>
</template>
<script>
import { useInvoiceTeamFieldsStore } from '@/store/invoice-team-fields';
import { useTeamFieldsStore } from '@/store/team-fields';
import AppEditable from '@/components/form/AppEditable.vue';

export default {
  props: ['invoice'],
  components: {
    AppEditable,
  },
  setup() {
    const invoiceTeamFieldsStore = useInvoiceTeamFieldsStore();
    const teamFieldsStore = useTeamFieldsStore();
    return { invoiceTeamFieldsStore, teamFieldsStore };
  },
  methods: {
    updateProp(props, field) {
      this.invoiceTeamFieldsStore.updateInvoiceTeamField({
        props,
        fieldId: field.id,
        invoiceId: this.invoice.id,
      });
      this.teamFieldsStore.updateTeamField({
        fieldId: field.team_field_id,
        props,
      });
    },
  },
};
</script>
