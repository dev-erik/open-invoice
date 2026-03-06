<template>
    <teleport to="body">
        <div v-if="isOpen" class="modal d-block" tabindex="-1" @click.self="close">
            <div class="modal-dialog modal-dialog-centered modal-md">
                <div class="modal-content bg-base dp--24 text-center">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ $t('import-modal:title') }}</h5>
                        <button type="button" class="btn-close" @click="close"></button>
                    </div>
                    <div class="modal-body">
                        <p>
                            <AppFileInput @selected="onSelected" :button-text="$t('import-modal:button_text')"/>
                            <AppError :errors="errors" field="file"/>
                        </p>
                        <p>
                            <small>{{ $t('import-modal:warning') }}</small>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="isOpen" class="modal-backdrop fade show"></div>
    </teleport>
</template>

<script>
import { useDataStore } from '@/store/data';
import AppFileInput from './form/AppFileInput.vue';
import Errors from '../utils/errors';
import AppError from './form/AppError.vue';

export default {
  components: {
    AppError,
    AppFileInput,
  },
  data() {
    return {
      errors: new Errors(),
    };
  },
  computed: {
    isOpen() {
      return useDataStore().isImportModalOpen;
    },
  },
  methods: {
    close() {
      useDataStore().isImportModalOpen = false;
    },
    onSelected(payload) {
      try {
        const data = JSON.parse(payload.content);
        useDataStore().importJson(data);
        this.close();
      } catch (e) {
        return this.errors.set({
          file: [this.$t('import-modal:on-select-error')],
        });
      }
    },
  },
};
</script>
