<template>
    <div>
        <h3>
            {{ $t('invoice-header:invoice_title') }}
            <AppEditable :value="invoice.number"
                         :errors="errors"
                         field="number"
                         :placeholder="$t('invoice-header:invoice_number')"
                         @change="updateProp({ number: $event })"/>
        </h3>
        {{ $t('invoice-header:issued_at') }}
        <span class="editable__item" @click="showIssuedAtModal = true">{{ formatDate(invoice.issued_at, 'D. MMM YYYY', 'YYYY-MM-DD') }}</span>
        <div v-if="showIssuedAtModal" class="modal d-block" tabindex="-1" @click.self="showIssuedAtModal = false">
            <div class="modal-dialog modal-sm modal-dialog-centered">
                <div class="modal-content bg-base dp--24">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ $t('invoice-header:modal_issued_at_title') }}</h5>
                        <button type="button" class="btn-close" @click="showIssuedAtModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <AppDatePicker :value="invoice.issued_at"
                                       @change="updateProp({ issued_at: $event })"
                                       :errors="errors"
                                       :inline="true"
                                       field="issued_at"/>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="showIssuedAtModal" class="modal-backdrop fade show"></div>

        <br>{{ $t('invoice-header:due_at') }}
        <span class="editable__item" @click="showDueAtModal = true">{{ formatDate(invoice.due_at, 'D. MMM YYYY', 'YYYY-MM-DD') }}</span>
        <div v-if="showDueAtModal" class="modal d-block" tabindex="-1" @click.self="showDueAtModal = false">
            <div class="modal-dialog modal-sm modal-dialog-centered">
                <div class="modal-content bg-base dp--24">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ $t('invoice-header:modal_due_at_title') }}</h5>
                        <button type="button" class="btn-close" @click="showDueAtModal = false"></button>
                    </div>
                    <div class="modal-body">
                        <AppDatePicker :value="invoice.due_at"
                                       @change="updateProp({ due_at: $event })"
                                       :errors="errors"
                                       :inline="true"
                                       field="due_at"/>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="showDueAtModal" class="modal-backdrop fade show"></div>

        <span :class="{'d-print-none': !invoice.late_fee}">
            <br>{{ $t('invoice-header:late_fee') }}
            <AppEditable :value="formatCurrency(invoice.late_fee)"
                         :errors="errors"
                         suffix="%"
                         field="late_fee"
                         :placeholder="$t('invoice-header:add_late_fee')"
                         @change="updateProp({ late_fee: $event })"/>
        </span>
    </div>
</template>
<script>
import AppEditable from '@/components/form/AppEditable.vue';
import AppDatePicker from '@/components/form/AppDatePicker.vue';
import { formatDate } from '@/filters/date.filter';
import { formatCurrency } from '@/filters/currency.filter';

export default {
  props: ['invoice', 'errors'],
  components: {
    AppEditable,
    AppDatePicker,
  },
  data() {
    return {
      showIssuedAtModal: false,
      showDueAtModal: false,
    };
  },
  methods: {
    formatDate,
    formatCurrency,
    updateProp(props) {
      this.$emit('update', props);
    },
  },
};
</script>
