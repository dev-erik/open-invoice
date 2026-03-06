<template>
    <div>
        <div v-for="field in team.fields" :key="field.id" class="col-12">
            <AppEditable :value="field.label"
                         :placeholder="$t('team-fields:label')"
                         @change="updateFieldProp({ label: $event }, field)"/>
            <i class="material-icons md-18 float-end pointer" @click="removeField(field)">close</i>
            <AppInput :value="field.value" @change="updateFieldProp({ value: $event }, field)"
                      :placeholder="field.label"/>
        </div>
        <div class="col-12">
            <button class="btn btn-sm btn-secondary" @click="addNewField">
                <i class="material-icons md-18">add</i>
                {{ $t('team-fields:field') }}
            </button>
        </div>
    </div>
</template>
<script>
import { useTeamFieldsStore } from '@/store/team-fields';
import NotificationService from '@/services/notification.service';
import AppInput from '@/components/form/AppInput.vue';
import AppEditable from '@/components/form/AppEditable.vue';

export default {
  props: ['team'],
  components: {
    AppEditable,
    AppInput,
  },
  methods: {
    addNewField() {
      useTeamFieldsStore().addNewField(this.team.id);
    },
    async removeField(field) {
      const confirmed = confirm(`${this.$t('team-fields:delete_modal.title')} ${field.label}?`);
      if (confirmed) {
        await useTeamFieldsStore().deleteTeamField(field.id);
        try {
          NotificationService.success(this.$t('team-fields:notification_delete'));
        } catch (err) {
          NotificationService.error(err.message);
        }
      }
    },
    updateFieldProp(props, field) {
      useTeamFieldsStore().updateTeamField({
        props,
        fieldId: field.id,
      });
    },
  },
};
</script>
