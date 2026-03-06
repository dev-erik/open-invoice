<template>
    <teleport to="body">
        <div v-if="isOpen" class="modal d-block" tabindex="-1" @click.self="close">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content bg-base dp--24">
                    <TeamForm @done="close"/>
                </div>
            </div>
        </div>
        <div v-if="isOpen" class="modal-backdrop fade show"></div>
    </teleport>
</template>

<script>
import { useTeamsStore } from '@/store/teams';
import { useInvoicesStore } from '@/store/invoices';
import TeamForm from '@/components/team/TeamForm.vue';

export default {
  components: {
    TeamForm,
  },
  computed: {
    isOpen() {
      return useTeamsStore().isModalOpen;
    },
    team() {
      return useTeamsStore().team;
    },
    invoice() {
      return useInvoicesStore().invoice;
    },
  },
  mounted() {
    this.getTeam();
  },
  methods: {
    getTeam() {
      useTeamsStore().getTeam();
    },
    async close() {
      await this.promptUpdateInvoice();
      useTeamsStore().isModalOpen = false;
    },
    async promptUpdateInvoice() {
      if (this.$route.name === 'invoice') {
        useInvoicesStore().prefillTeam({
          invoiceId: this.invoice.id,
        });
      }
    },
  },
};
</script>
