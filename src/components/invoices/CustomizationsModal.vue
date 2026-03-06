<template>
    <div v-if="isOpen" class="modal d-block" tabindex="-1" @click.self="close">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content bg-base dp--24 text-center">
                <div class="modal-header">
                    <h5 class="modal-title">{{ $t('customizations-modal:title') }}</h5>
                    <button type="button" class="btn-close" @click="close"></button>
                </div>
                <div class="modal-body">
                    <AppTextarea :modelValue="team ? team.custom_css : ''"
                                 @change="updateProp({ custom_css: $event })"
                                 :label="$t('customizations-modal:textarea_label')"
                                 field="custom_css"
                                 :errors="errors"
                                 input-classes="min-vh-50 text-monospace"
                                 class="text-start"/>
                </div>
            </div>
        </div>
    </div>
    <div v-if="isOpen" class="modal-backdrop fade show"></div>
</template>

<script>
import { useInvoicesStore } from '@/store/invoices';
import { useTeamsStore } from '@/store/teams';
import AppTextarea from '@/components/form/AppTextarea.vue';
import Errors from '@/utils/errors';
import NotificationService from '@/services/notification.service';

export default {
  data() {
    return {
      errors: new Errors(),
    };
  },
  components: {
    AppTextarea,
  },
  setup() {
    const invoicesStore = useInvoicesStore();
    const teamsStore = useTeamsStore();
    return { invoicesStore, teamsStore };
  },
  computed: {
    isOpen: {
      get() {
        return this.invoicesStore.isCustomizationsModalOpen;
      },
      set(val) {
        this.invoicesStore.isCustomizationsModalOpen = val;
      },
    },
    team() {
      return this.teamsStore.team;
    },
  },
  watch: {
    team() {
      if (this.team) {
        this.updateStyleEl(this.team.custom_css);
      }
    },
  },
  created() {
    this.initStyleEl();
  },
  methods: {
    initStyleEl() {
      const styleEl = document.createElement('style');
      styleEl.setAttribute('id', 'custom-styles');
      styleEl.setAttribute('type', 'text/css');
      document.head.appendChild(styleEl);
    },
    sanitizeCss(css) {
      if (!css) return '';
      const forbidden = /@import|url\s*\(|expression\s*\(|javascript:|behavior\s*:|binding\s*:|\\|\/\*/gi;
      return css.replace(forbidden, '/* blocked */');
    },
    updateStyleEl(styles) {
      const styleEl = document.getElementById('custom-styles');
      if (styleEl) {
        styleEl.textContent = this.sanitizeCss(styles);
      }
    },
    close() {
      this.isOpen = false;
    },
    updateProp(props) {
      this.errors.clear();
      this.teamsStore.updateTeam(props)
        .then(() => {
          NotificationService.success(this.$t('customizations-modal:updated'));
          this.updateStyleEl(props.custom_css);
        })
        .catch(err => this.errors.set(err.errors));
    },
  },
};
</script>
