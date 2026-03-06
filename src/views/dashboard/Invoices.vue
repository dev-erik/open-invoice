<template>
    <div>
        <div class="row">
            <div class="col-12 mb-4 pe-0 d-flex justify-content-between">
                <h4 class="mb-0">{{ $t('invoices:title') }}</h4>
                <div>
                    <button class="btn btn-sm btn-outline-dark"
                            :class="{ 'me-3': !isStorageLocal }"
                            @click="createNewInvoice">{{ $t('invoices:new_invoice') }}
                    </button>
                    <div class="dropdown d-inline-block" v-if="isStorageLocal">
                        <button class="btn btn-link btn-sm dropdown-toggle no-caret" type="button"
                                data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="material-icons">more_vert</i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li><button class="dropdown-item" @click="exportJson">{{ $t('invoices:export') }}</button></li>
                            <li><button class="dropdown-item" @click="openImportModal">{{ $t('invoices:import') }}</button></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <InvoicesList/>
            </div>
        </div>
    </div>
</template>

<script>
import { useTeamsStore } from '@/store/teams';
import { useInvoicesStore } from '@/store/invoices';
import { useDataStore } from '@/store/data';
import InvoicesList from '@/components/invoices/InvoicesList.vue';
import config from '@/config/app.config';

export default {
  name: 'invoices',
  components: {
    InvoicesList,
  },
  setup() {
    const teamsStore = useTeamsStore();
    const invoicesStore = useInvoicesStore();
    const dataStore = useDataStore();
    return { teamsStore, invoicesStore, dataStore };
  },
  computed: {
    team() {
      return this.teamsStore.team;
    },
    isStorageLocal() {
      return config.storageType === 'local';
    },
  },
  methods: {
    createNewInvoice() {
      this.invoicesStore.createNewInvoice()
        .then(id => this.$router.push({ name: 'invoice', params: { id } }));
    },
    exportJson() {
      this.dataStore.exportJson();
    },
    openImportModal() {
      this.dataStore.isImportModalOpen = true;
    },
  },
};
</script>
