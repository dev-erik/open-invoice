<template>
    <div class="d-flex align-items-center gap-2">
        <span class="text-nowrap small">
            <i class="material-icons md-18 align-middle">account_balance</i>
        </span>
        <Multiselect
            :options="options"
            :modelValue="selected"
            @update:modelValue="onSelect"
            :searchable="true"
            :canClear="true"
            :canDeselect="true"
            placeholder="Select VAT / GST rate..."
            valueProp="code"
            label="displayLabel"
            :object="true"
            class="vat-selector"
        />
    </div>
</template>

<script>
import Multiselect from '@vueform/multiselect';
import { vatRates } from '@/data/vat-rates';

export default {
  components: { Multiselect },
  props: {
    vatCountry: { default: null },
    vatRate: { default: null },
  },
  emits: ['change'],
  computed: {
    options() {
      return vatRates.map(v => ({
        ...v,
        displayLabel: v.rate > 0
          ? `${v.country} — ${v.rate}% ${v.taxName}`
          : `${v.country} — ${v.taxName} (enter rate)`,
      }));
    },
    selected() {
      if (!this.vatCountry) return null;
      return this.options.find(o => o.code === this.vatCountry) || null;
    },
  },
  methods: {
    onSelect(value) {
      if (!value) {
        this.$emit('change', null);
      } else {
        this.$emit('change', {
          code: value.code,
          rate: value.rate,
          taxName: value.taxName,
          country: value.country,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.vat-selector {
  max-width: 340px;
  font-size: 0.875rem;
}
</style>
