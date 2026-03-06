<template>
    <div class="form-group">
        <label :for="field" :class="labelClasses" v-if="label">{{ label }}</label>
        <div :class="containerClasses">
            <input :disabled="disabled"
                   :type="inputType"
                   :id="field"
                   :placeholder="placeholder"
                   class="form-control"
                   :class="[
                   errors && errors.has(field) ? 'is-invalid' : '',
                   size ? 'form-control-' + size : '',
                   ...inputClassList,
                   ]"
                   :autocomplete="autocomplete"
                   :maxlength="max"
                   :value="modelValue"
                   @input="$emit('update:modelValue', $event.target.value)"
                   @change="$emit('change', $event.target.value)"
                   @keydown.self.enter.exact="$emit('submit', $event.target.value)"
                   :ref="field"
            >
            <slot></slot>
        </div>
        <AppError v-if="errors" :errors="errors" :field="field"/>
    </div>
</template>

<script>
import AppError from '@/components/form/AppError.vue';

export default {
  components: {
    AppError,
  },
  props: {
    errors: {},
    label: {},
    modelValue: {},
    field: {},
    type: {},
    max: {},
    disabled: {},
    placeholder: {},
    size: {},
    labelClasses: {},
    inputClasses: {},
    containerClasses: {},
    autocomplete: {
      default: 'on',
    },
  },
  emits: ['update:modelValue', 'change', 'submit'],
  computed: {
    inputType() {
      return this.type || 'text';
    },
    inputClassList() {
      if (Array.isArray(this.inputClasses)) return this.inputClasses;
      if (this.inputClasses) return [this.inputClasses];
      return [];
    },
  },
  methods: {
    focus() {
      this.$refs[this.field].focus();
    },
  },
};
</script>
