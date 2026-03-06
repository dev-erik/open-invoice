<template>
    <div>
        <div v-for="tax in taxes" :key="tax.id">
            <AppEditable :value="tax.label"
                         :placeholder="$t('team-taxes:label')"
                         @change="updateTaxProp({ label: $event }, tax)"/> (%)
            <i class="material-icons md-18 float-end pointer" @click="removeTax(tax)">close</i>
            <AppInput :value="tax.value" @change="updateTaxProp({ value: $event }, tax)"
                      :placeholder="tax.label" type="number"/>
        </div>
        <button type="button" class="btn btn-sm btn-secondary" @click="addNewTax">
            <i class="material-icons md-18">add</i>
            {{ $t('team-taxes:tax') }}
        </button>
    </div>
</template>
<script>
import { useTaxesStore } from '@/store/taxes';
import NotificationService from '@/services/notification.service';
import AppInput from '@/components/form/AppInput.vue';
import AppEditable from '@/components/form/AppEditable.vue';

export default {
  components: {
    AppEditable,
    AppInput,
  },
  emits: ['changed'],
  computed: {
    taxes() {
      return useTaxesStore().all;
    },
  },
  methods: {
    addNewTax() {
      useTaxesStore().addNewTax();
    },
    async removeTax(field) {
      const confirmed = confirm(`${this.$t('team-taxes:delete_modal.title')} ${field.label}?`);
      if (confirmed) {
        await useTaxesStore().deleteTax(field.id);
        try {
          this.$emit('changed');
          NotificationService.success(this.$t('team-taxes:notification_deleted'));
        } catch (err) {
          NotificationService.error(err.message);
        }
      }
    },
    updateTaxProp(props, tax) {
      useTaxesStore().updateTax({
        props,
        taxId: tax.id,
      });
      this.$emit('changed');
    },
  },
};
</script>
