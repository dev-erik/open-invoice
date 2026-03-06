<template>
    <div>
        <div class="form-check">
            <input type="checkbox" :id="field"
                   class="form-check-input"
                   :class="{
                     'is-invalid': errors && errors.has(field)
                 }"
                   :checked="modelValue"
                   @input="$emit('update:modelValue', $event.target.checked)">
            <label class="form-check-label" :for="field">
                {{ label }}
                <slot/>
            </label>
            <AppError v-if="errors" :errors="errors" :field="field"/>
        </div>
    </div>
</template>

<script>
import AppError from '@/components/form/AppError.vue';

export default {
  components: {
    AppError,
  },
  props: {
    errors: { default: null },
    label: { default: '' },
    modelValue: { default: false },
    field: { default: '' },
  },
  emits: ['update:modelValue'],
};
</script>
