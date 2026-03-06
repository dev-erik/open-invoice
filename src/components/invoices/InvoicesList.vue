<template>
    <div class="table-responsive">
        <div v-if="!invoices" class="col-12">{{ $t('invoices-list:loading') }}</div>
        <table class="table table--card table-hover" v-else-if="invoices && invoices.length > 0">
            <thead>
            <tr>
                <th>{{ $t('invoices-list:invoice_number') }}</th>
                <th>{{ $t('invoices-list:client') }}</th>
                <th>{{ $t('invoices-list:issued_at') }}</th>
                <th>{{ $t('invoices-list:total') }}</th>
                <th class="text-end">{{ $t('invoices-list:status') }}</th>
            </tr>
            </thead>
            <tbody v-if="invoices">
            <tr v-for="invoice in invoices"
                class="pointer"
                :key="invoice.id"
                @click="openInvoice(invoice)">
                <td>{{ invoice.number }}</td>
                <td>{{ invoice.client ? invoice.client.company_name : '' }}</td>
                <td>{{ formatDate(invoice.issued_at, 'D MMM YYYY', 'YYYY-MM-DD') }}</td>
                <td>
                    {{ formatCurrency(invoice.subTotal) }}
                    <small v-if="invoice.taxTotal"><br>({{ formatCurrency(invoice.total) }})</small>
                </td>
                <td class="text-end text-capitalize">
                    <i class="material-icons material-icons-round md-18 me-2 text-warning"
                       v-if="isOverDue(invoice)"
                       title="Overdue">warning</i>
                    <i class="material-icons material-icons-round md-18 me-2 text-success"
                       v-else-if="invoice.status === 'paid'">done</i>
                    {{ $t(`statuses:${invoice.status}`) }}
                </td>
            </tr>
            </tbody>
        </table>
        <EmptyState v-else/>
    </div>
</template>
<script>
import { useInvoicesStore } from '@/store/invoices';
import { formatDate } from '@/filters/date.filter';
import { formatCurrency } from '@/filters/currency.filter';
import EmptyState from '@/components/EmptyState.vue';
import dayjs from 'dayjs';

export default {
  components: {
    EmptyState,
  },
  setup() {
    const invoicesStore = useInvoicesStore();
    return { invoicesStore };
  },
  computed: {
    invoices() {
      return this.invoicesStore.all;
    },
  },
  mounted() {
    this.invoicesStore.getInvoices();
  },
  methods: {
    formatDate,
    formatCurrency,
    openInvoice(invoice) {
      this.invoicesStore.invoiceId = invoice.id;
      this.$router.push({
        name: 'invoice',
        params: { id: invoice.id },
      });
    },
    isOverDue(invoice) {
      return invoice.status === 'sent' && invoice.due_at < dayjs().format();
    },
  },
};
</script>
