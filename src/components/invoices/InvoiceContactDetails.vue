<template>
    <div>
        <AppEditable :value="invoice.from_website"
                     :errors="errors"
                     field="from_website"
                     :placeholder="$t('invoice-contact-details:add_website')"
                     class="break-line"
                     @change="updateProp({ from_website: $event })"/>
        <AppEditable :value="invoice.from_email"
                     :errors="errors"
                     field="from_email"
                     :placeholder="$t('invoice-contact-details:add_email')"
                     class="break-line"
                     @change="updateProp({ from_email: $event })"/>
        <AppEditable :value="invoice.from_phone"
                     :errors="errors"
                     field="from_phone"
                     :placeholder="$t('invoice-contact-details:add_phone')"
                     @change="updateProp({ from_phone: $event })"/>
    </div>
</template>
<script>
import AppEditable from '@/components/form/AppEditable.vue';

export default {
  props: ['invoice', 'errors'],
  components: {
    AppEditable,
  },
  methods: {
    updateProp(props) {
      this.$emit('update', props);
    },
  },
};
</script>
