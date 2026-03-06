<template>
    <tr>
        <td>
            <AppEditable :modelValue="row.item"
                         :errors="errors"
                         :field="`rows.${index}.item`"
                         :placeholder="$t('invoice-row:enter_item')"
                         @change="updateProp({ item: $event })"/>
        </td>
        <td>
            <AppEditable :modelValue="row.quantity"
                         :errors="errors"
                         :field="`rows.${index}.quantity`"
                         :placeholder="$t('invoice-row:enter_quantity')"
                         @change="updateProp({ quantity: $event })"/>
        </td>
        <td>
            <AppEditable :modelValue="row.unit"
                         :errors="errors"
                         :field="`rows.${index}.unit`"
                         :placeholder="$t('invoice-row:enter_unit')"
                         @change="updateProp({ unit: $event })"/>
        </td>
        <td>
            <AppEditable :modelValue="formatCurrency(row.price)"
                         :errors="errors"
                         :field="`rows.${index}.price`"
                         :placeholder="$t('invoice-row:enter_price')"
                         @change="updateProp({ price: $event })"/>
        </td>
        <td v-for="(tax, taxIndex) in row.taxes" :title="tax.label">
            <AppEditable v-if="tax.row_id"
                         :modelValue="formatCurrency(tax.value)"
                         :errors="errors"
                         :field="`rows.${index}.taxes.${taxIndex}.value`"
                         :placeholder="$t('invoice-row:enter_tax')"
                         @change="updateTaxProp({ value: $event }, tax)"/>
        </td>
        <td class="text-end position-relative">
            {{ formatCurrency(row.quantity * row.price) }}
            <button class="btn btn-sm d-print-none invoice__row-control"
                    @click="removeRow(row)">
                <i class="material-icons md-18 pointer">remove</i>
            </button>
        </td>
    </tr>
</template>

<script>
import { formatCurrency } from '@/filters/currency.filter';
import { useInvoiceRowsStore } from '@/store/invoice-rows';
import AppEditable from '@/components/form/AppEditable.vue';

export default {
  props: ['row', 'errors', 'index'],
  name: 'InvoiceRow',
  components: {
    AppEditable,
  },
  setup() {
    const invoiceRowsStore = useInvoiceRowsStore();
    return { invoiceRowsStore };
  },
  methods: {
    formatCurrency,
    updateProp(props) {
      this.invoiceRowsStore.updateInvoiceRow({
        props,
        id: this.row.id,
        invoiceId: this.row.invoice_id,
      });
    },
    updateTaxProp(props, tax) {
      this.invoiceRowsStore.updateInvoiceRowTax({
        props,
        invoiceId: this.row.invoice_id,
        taxId: tax.id,
      });
    },
    async removeRow(row) {
      this.invoiceRowsStore.removeRow(row.invoice_id, row.id);
      this.updateProp();
    },
  },
};
</script>
