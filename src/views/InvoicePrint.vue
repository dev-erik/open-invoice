<template>
    <div>
        <InvoiceForm/>
    </div>
</template>

<script>
import InvoiceForm from '@/components/invoices/InvoiceForm.vue';

export default {
  name: 'invoice-print',
  components: {
    InvoiceForm,
  },
};
</script>
