<template>
    <tfoot>
    <tr class="text-end">
        <td :colspan="colspan">{{ $t('invoice-totals:subtotal') }}</td>
        <td>{{ formatCurrency(invoice.subTotal) }}</td>
    </tr>
    <tr class="text-end" v-for="tax in invoice.taxes" :key="tax.label">
        <td :colspan="colspan">
            {{ tax.label }} ({{ tax.rate }}%)
        </td>
        <td>{{ formatCurrency(tax.total) }}</td>
    </tr>
    <tr class="text-end">
        <th :colspan="colspan">
            {{ $t('invoice-totals:total') }}
            <AppEditable :value="invoice.currency"
                         :errors="errors"
                         field="currency"
                         :placeholder="$t('invoice-totals:add_currency')"
                         @change="updateProp({ currency: $event })"/>
        </th>
        <th class="text-nowrap">{{ formatCurrency(invoice.total) }}</th>
    </tr>
    </tfoot>
</template>
<script>
import { useInvoiceRowsStore } from '@/store/invoice-rows';
import AppEditable from '@/components/form/AppEditable.vue';
import { formatCurrency } from '@/filters/currency.filter';

export default {
  props: ['invoice', 'errors'],
  components: {
    AppEditable,
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
      return 4 + this.taxes.length;
    },
  },
  methods: {
    formatCurrency,
    updateProp(props) {
      this.$emit('update', props);
    },
  },
};
</script>
