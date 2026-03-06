<template>
    <tr class="d-print-none">
        <td :colspan="colspan">
            <button class="btn btn-sm" @click="addRow">
                <i class="material-icons md-18 pointer">add</i>
            </button>
            <AppError :errors="errors" field="rows"/>
        </td>
    </tr>
</template>
<script>
import { useInvoiceRowsStore } from '@/store/invoice-rows';
import AppError from '@/components/form/AppError.vue';

export default {
  props: ['invoice', 'errors'],
  components: {
    AppError,
  },
  setup() {
    const invoiceRowsStore = useInvoiceRowsStore();
    return { invoiceRowsStore };
  },
  computed: {
    taxes() {
      return this.invoiceRowsStore.taxes;
    },
    colspan() {
      return 5 + this.taxes.length;
    },
  },
  methods: {
    addRow() {
      this.invoiceRowsStore.addRow(this.invoice.id);
    },
  },
};
</script>
