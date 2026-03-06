<template>
    <div>
        <img v-if="team.logo_url"
             class="pointer"
             @click="openModal"
             :src="team.logo_url" style="width:100%; max-width:200px;">
        <button class="btn btn-sm d-print-none" @click="openModal" v-else>
            <i class="material-icons material-icons-round md-36">file_upload</i>
        </button>
        <AppError :errors="errors" field="logo_url"/>

        <teleport to="body">
            <div v-if="isModalOpen" class="modal d-block" tabindex="-1" @click.self="isModalOpen = false">
                <div class="modal-dialog modal-dialog-centered modal-sm">
                    <div class="modal-content bg-base dp--24 text-center">
                        <div class="modal-header">
                            <h5 class="modal-title">{{ $t('team-logo:modal_title') }}</h5>
                            <button type="button" class="btn-close" @click="isModalOpen = false"></button>
                        </div>
                        <div class="modal-body">
                            <AppFileInput accept="image/*" class="mb-4" @selected="logoSelected"
                                          :button-text="$t('team-logo:button_text')" output-type="base64"/>
                            {{ $t('team-logo:or') }}
                            <AppInput :value="team.logo_url"
                                      class="mt-4"
                                      @change="updateTeam({ logo_url: $event })"
                                      :label="$t('team-logo:logo_url')"
                                      field="logo_url"
                                      :errors="errors"
                                      type="url"/>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="isModalOpen" class="modal-backdrop fade show"></div>
        </teleport>
    </div>
</template>
<script>
import { useTeamsStore } from '@/store/teams';
import AppError from '@/components/form/AppError.vue';
import AppInput from '@/components/form/AppInput.vue';
import AppFileInput from '@/components/form/AppFileInput.vue';

export default {
  props: ['errors'],
  components: {
    AppFileInput,
    AppError,
    AppInput,
  },
  data() {
    return {
      isModalOpen: false,
    };
  },
  computed: {
    team() {
      return useTeamsStore().team;
    },
  },
  methods: {
    updateTeam(props) {
      useTeamsStore().updateTeam(props);
    },
    logoSelected(payload) {
      this.errors.clear();
      if (payload.size / 1000 > 512) {
        return this.errors.set({ logo_url: [this.$t('team-logo:logo_url_err')] });
      }
      this.updateTeam({ logo_url: payload.content });
    },
    openModal() {
      this.isModalOpen = true;
    },
  },
};
</script>
