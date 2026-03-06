<template>
    <teleport to="body">
        <div v-if="isOpen" class="modal d-block" tabindex="-1" @click.self="close">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content bg-base dp--24">
                    <ClientForm @done="close()"/>
                </div>
            </div>
        </div>
        <div v-if="isOpen" class="modal-backdrop fade show"></div>
    </teleport>
</template>

<script>
import { useClientsStore } from '@/store/clients';
import { useInvoicesStore } from '@/store/invoices';
import ClientForm from '@/components/clients/ClientForm.vue';

export default {
  components: {
    ClientForm,
  },
  computed: {
    isOpen() {
      return useClientsStore().isModalOpen;
    },
    client() {
      return useClientsStore().client;
    },
    invoice() {
      return useInvoicesStore().invoice;
    },
  },
  watch: {
    '$route.query.clientId'() {
      this.getClient();
    },
  },
  mounted() {
    this.getClient();
  },
  methods: {
    getClient() {
      const clientsStore = useClientsStore();
      const query = this.$route.query;
      if (Object.prototype.hasOwnProperty.call(query, 'clientId')) {
        if ((this.client && this.client.id !== query.clientId) || !this.client) {
          clientsStore.getClient(query.clientId);
        }
        clientsStore.isModalOpen = true;
      } else {
        clientsStore.isModalOpen = false;
      }
    },
    async close() {
      await this.promptUpdateInvoice();
      const clientsStore = useClientsStore();
      this.$router.push({ query: {} });
      clientsStore.getClients();
      clientsStore.isModalOpen = false;
    },
    async promptUpdateInvoice() {
      if (this.$route.name === 'invoice' && this.invoice && this.client && this.invoice.client_id === this.client.id) {
        useInvoicesStore().prefillClient({
          client: this.client,
          invoiceId: this.invoice.id,
        });
      }
    },
  },
};
</script>
