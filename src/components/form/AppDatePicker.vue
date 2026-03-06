<template>
    <div>
        <label :for="field" :class="labelClasses" v-if="label">{{ label }}</label>
        <div :class="containerClasses">
            <VueDatePicker :disabled="disabled"
                        :inline="inline"
                        :uid="field"
                        :class="[
                            errors && errors.has(field) ? 'is-invalid' : '',
                            ...inputClassList,
                            ]"
                        :placeholder="placeholder"
                        :auto-apply="true"
                        :model-value="inputValue"
                        @update:model-value="outputValue"
                        :enable-time-picker="type === 'datetime'"
                        :range="mode === 'range'"
                        :format="displayFormat"
                        :week-start="1"
                        :text-input="!inline"
            />
            <slot></slot>
            <AppError v-if="errors" :errors="errors" :field="field"/>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import AppError from '@/components/form/AppError.vue';

export default {
  components: {
    AppError,
    VueDatePicker,
  },
  props: {
    errors: {},
    label: {},
    mode: {},
    modelValue: {},
    field: {},
    disabled: {},
    inline: {
      default: false,
    },
    format: {
      default: 'yyyy-MM-dd',
    },
    modelFormat: {
      default: 'YYYY-MM-DD',
    },
    type: {},
    placeholder: {},
    labelClasses: {},
    inputClasses: {},
    containerClasses: {},
  },
  emits: ['update:modelValue', 'change'],
  computed: {
    inputClassList() {
      if (Array.isArray(this.inputClasses)) return this.inputClasses;
      if (this.inputClasses) return [this.inputClasses];
      return [];
    },
    displayFormat() {
      return this.format || 'yyyy-MM-dd';
    },
    inputValue() {
      if (!this.modelValue) return null;
      if (Array.isArray(this.modelValue)) {
        return this.modelValue.map(val => dayjs(val, this.modelFormat).toDate());
      }
      return dayjs(this.modelValue, this.modelFormat).toDate();
    },
  },
  methods: {
    outputValue(event) {
      if (event === null) {
        this.$emit('update:modelValue', null);
        this.$emit('change', null);
        return;
      }
      const value = Array.isArray(event)
        ? event.map(val => this.toModelFormat(val))
        : this.toModelFormat(event);
      this.$emit('update:modelValue', value);
      this.$emit('change', value);
    },
    toModelFormat(val) {
      return val ? dayjs(val).format(this.modelFormat) : null;
    },
  },
};
</script>
<style lang="scss">
.dp__main {
  width: 100%;
}
</style>
