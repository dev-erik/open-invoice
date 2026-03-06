<template>
    <div class="row" v-if="invoice">
        <div class="col-12 mb-4 d-flex justify-content-between align-items-start">
            <router-link class="btn btn-sm btn-light btn--icon-left"
                         :to="{name: 'invoices'}">
                <i class="material-icons">arrow_back</i>
                <span class="d-inline-block">{{ $t('invoice-controls:back') }}</span>
            </router-link>
            <div class="d-flex align-items-center">
                <AppSelect :modelValue="getStatusObj"
                           class="mb-0 me-2 text-capitalize multiselect--capitalize"
                           style="min-width: 160px"
                           :options="invoiceStatuses"
                           label-field="name"
                           @update:modelValue="updateProp({status: $event.value})"/>
                <button class="btn btn-outline-dark"
                        v-if="invoice.status === 'draft'"
                        @click="bookInvoice">{{ $t('invoice-controls:book') }}
                </button>
                <div class="dropdown">
                    <button class="btn btn-link dropdown-toggle no-caret" type="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="material-icons">more_vert</i>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li><h6 class="dropdown-header">{{ $t('invoice-controls:design_and_layout') }}</h6></li>
                        <li><button class="dropdown-item" @click="toggleCompact">
                            {{ invoice.is_compact ? $t('invoice-controls:comfortable') : $t('invoice-controls:compact') }}
                        </button></li>
                        <li><button class="dropdown-item" @click="openCustomizationsModal">
                            {{ $t('invoice-controls:customize') }}
                        </button></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><button class="dropdown-item" @click="print">{{ $t('invoice-controls:download_pdf') }}</button></li>
                        <li><button class="dropdown-item" @click="deleteInvoice">{{ $t('invoice-controls:delete') }}</button></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useInvoicesStore } from '@/store/invoices';
import NotificationService from '@/services/notification.service';
import AppSelect from '@/components/form/AppSelect.vue';

export default {
  components: {
    AppSelect,
  },
  setup() {
    const invoicesStore = useInvoicesStore();
    return { invoicesStore };
  },
  computed: {
    invoice() {
      return this.invoicesStore.invoice;
    },
    getStatusObj() {
      return this.invoiceStatuses
        .find(obj => obj.value === this.invoice.status);
    },
    invoiceStatuses() {
      return [{
        value: 'draft',
        name: this.$t('statuses:draft'),
      }, {
        value: 'booked',
        name: this.$t('statuses:booked'),
      }, {
        value: 'sent',
        name: this.$t('statuses:sent'),
      }, {
        value: 'paid',
        name: this.$t('statuses:paid'),
      }, {
        value: 'cancelled',
        name: this.$t('statuses:cancelled'),
      }];
    },
  },
  methods: {
    async deleteInvoice() {
      const confirmed = window.confirm(`${this.$t('invoice-controls:delete_modal.title')} ${this.invoice.number}?`);
      if (confirmed) {
        await this.invoicesStore.deleteInvoice(this.invoice);
        NotificationService.success('Deleted');
        this.$router.push({
          name: 'invoices',
        });
      }
    },
    bookInvoice() {
      this.invoicesStore.bookInvoice();
    },
    updateProp(props) {
      this.invoicesStore.updateInvoice({
        props,
        invoiceId: this.invoice.id,
      });
    },
    toggleCompact() {
      this.updateProp({ is_compact: !this.invoice.is_compact });
    },
    openCustomizationsModal() {
      this.invoicesStore.isCustomizationsModalOpen = true;
    },
    print() {
      window.print();
    },
  },
};
</script>
