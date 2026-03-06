<template>
    <div>
        <div v-for="field in client.fields" :key="field.id" class="col-sm-6">
            <AppEditable :value="field.label"
                         :placeholder="$t('client-fields:label')"
                         @change="updateFieldProp({ label: $event }, field)"/>
            <i class="material-icons md-18 float-end pointer" @click="removeField(field)">close</i>
            <AppInput :value="field.value" @change="updateFieldProp({ value: $event }, field)"
                      :placeholder="field.label"/>
        </div>
        <div class="col-12">
            <button class="btn btn-sm btn-secondary" @click="addNewField">
                <i class="material-icons md-18">add</i>
                {{ $t('client-fields:field') }}
            </button>
        </div>
    </div>
</template>
<script>
import { useClientFieldsStore } from '@/store/client-fields';
import NotificationService from '@/services/notification.service';
import AppInput from '@/components/form/AppInput.vue';
import AppEditable from '@/components/form/AppEditable.vue';

export default {
  props: ['client'],
  components: {
    AppEditable,
    AppInput,
  },
  computed: {
    isNew() {
      return this.client && this.client._isNew;
    },
  },
  methods: {
    addNewField() {
      useClientFieldsStore().addNewField(this.client.id);
    },
    async removeField(field) {
      const confirmed = confirm(`${this.$t('client-fields:delete_modal.title')} ${field.label}?`);
      if (confirmed) {
        await useClientFieldsStore().deleteClientField(field.id);
        try {
          NotificationService.success(this.$t('client-fields:notification_deleted'));
        } catch (err) {
          NotificationService.error(err.message);
        }
      }
    },
    updateFieldProp(props, field) {
      const clientFieldsStore = useClientFieldsStore();
      if (this.isNew) {
        return clientFieldsStore.updateClientFieldProps(field.id, props);
      }
      clientFieldsStore.updateClientField({
        props,
        fieldId: field.id,
      });
    },
  },
};
</script>
