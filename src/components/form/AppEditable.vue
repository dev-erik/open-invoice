<template>
    <span :class="{
        'text-muted': !tmpVal,
        'd-print-none': !tmpVal,
        'is-invalid': errors && errors.has(field)
         }"
          class="editable">
        <span ref="editable"
              class="editable__item"
              :contenteditable="!disabled"
              @input="onInput"
              @focusin="onFocusIn"
              @focusout="onFocusOut"
              :class="{'position-absolute': !tmpVal || (!tmpVal && !isFocused)}"
        ></span>
        <span v-if="!tmpVal" @click="focus"
              class="editable__item">{{ placeholder }}</span>
        <span v-if="suffix">{{ suffix }}</span>
        <AppError v-if="errors" :errors="errors" :field="field"/>
    </span>
</template>

<script>
import AppError from '@/components/form/AppError.vue';

export default {
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: 'Enter item',
    },
    disabled: {
      default: false,
    },
    suffix: {},
    errors: {},
    field: {},
  },
  emits: ['update:modelValue', 'change'],
  components: {
    AppError,
  },
  data() {
    return {
      focusInVal: null,
      tmpVal: null,
      isFocused: false,
    };
  },
  watch: {
    modelValue() {
      this.$refs.editable.innerText = this.modelValue;
      this.tmpVal = this.modelValue;
    },
  },
  mounted() {
    this.$refs.editable.innerText = this.modelValue;
    this.tmpVal = this.modelValue;
  },
  methods: {
    onInput(e) {
      this.tmpVal = e.target.innerText;
      this.$emit('update:modelValue', this.tmpVal);
    },
    onFocusIn() {
      this.isFocused = true;
      this.focusInVal = this.$refs.editable.innerText;
    },
    onFocusOut() {
      this.isFocused = false;
      if (this.focusInVal !== this.$refs.editable.innerText) {
        this.$emit('change', this.$refs.editable.innerText);
      }
    },
    focus() {
      this.$refs.editable.focus();
    },
  },
};
</script>
