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
            :placeholder="$t('invoice-vat:placeholder')"
            valueProp="code"
            label="displayLabel"
            :object="true"
            class="vat-selector"
        />
    </div>
</template>

<script>
import Multiselect from '@vueform/multiselect';
import { vatRates, countryFlag } from '@/data/vat-rates';
import { useLanguageStore } from '@/store/language';

const LOCALE_MAP = {
  en: 'en', ar: 'ar', bn: 'bn', de: 'de', es: 'es', et: 'et',
  fa: 'fa', fr: 'fr', id: 'id', it: 'it', ja: 'ja', kr: 'ko',
  nl: 'nl', pt_br: 'pt-BR', ru: 'ru', zh: 'zh',
};

export default {
  components: { Multiselect },
  props: {
    vatCountry: { default: null },
    vatRate: { default: null },
  },
  emits: ['change'],
  computed: {
    bcp47Locale() {
      const lang = useLanguageStore().lang;
      return LOCALE_MAP[(lang && lang.code) || 'en'] || 'en';
    },
    countryNames() {
      try {
        return new Intl.DisplayNames([this.bcp47Locale], { type: 'region' });
      } catch {
        return new Intl.DisplayNames(['en'], { type: 'region' });
      }
    },
    options() {
      const enterRate = this.$t('invoice-vat:enter_rate');
      return vatRates.map(v => {
        const flag = countryFlag(v.code);
        let localName;
        try { localName = this.countryNames.of(v.code); } catch { localName = v.country; }
        const rateText = v.rate > 0
          ? `${v.rate}% ${v.taxName}`
          : `${v.taxName} (${enterRate})`;
        return {
          ...v,
          displayLabel: `${flag}  ${localName} — ${rateText}`,
        };
      });
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
