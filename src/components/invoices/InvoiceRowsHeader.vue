<template>
    <thead>
        <tr>
            <th>{{ $t('invoice-rows-header:item') }}</th>
            <th>{{ $t('invoice-rows-header:quantity') }}</th>
            <th>{{ $t('invoice-rows-header:unit') }}</th>
            <th>{{ $t('invoice-rows-header:price') }}</th>
            <th v-for="tax in taxes" :key="tax.id">
                {{ tax.label }} %
            </th>
            <th class="text-right">{{ $t('invoice-rows-header:sum') }}</th>
        </tr>
    </thead>
</template>

<script>
import { useInvoiceRowsStore } from '@/store/invoice-rows';

export default {
  setup() {
    const invoiceRowsStore = useInvoiceRowsStore();
    return { invoiceRowsStore };
  },
  computed: {
    taxes() {
      return this.invoiceRowsStore.taxes;
    },
  },
};
</script>
