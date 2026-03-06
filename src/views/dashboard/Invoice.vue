<template>
    <div v-if="team">
        <InvoiceControls class="d-print-none"/>
        <InvoiceForm/>
    </div>
</template>

<script>
import { useTeamsStore } from '@/store/teams';
import InvoiceForm from '@/components/invoices/InvoiceForm.vue';
import InvoiceControls from '@/components/invoices/InvoiceControls.vue';

export default {
  name: 'invoice',
  components: {
    InvoiceControls,
    InvoiceForm,
  },
  setup() {
    const teamsStore = useTeamsStore();
    return { teamsStore };
  },
  computed: {
    team() {
      return this.teamsStore.team;
    },
  },
};
</script>
