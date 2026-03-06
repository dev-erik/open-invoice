<template>
    <div class="form-group multiselect--form-control">
        <label :for="field" v-if="label">{{ label }}</label>
        <Multiselect :id="field"
                     :options="options"
                     :valueProp="trackBy || 'value'"
                     :disabled="disabled"
                     :label="labelField || 'label'"
                     :canDeselect="allowEmpty"
                     :canClear="allowEmpty"
                     :searchable="true"
                     :modelValue="modelValue"
                     @update:modelValue="onUpdate"
                     @search-change="$emit('search-change', $event)"
                     :placeholder="placeholder"
                     :loading="loading"
                     :class="{
                         'is-invalid': errors && errors.has(field)
                     }"
                     :mode="multiple ? 'tags' : 'single'"
                     :object="true"
        >
            <template v-for="(_, name) in $slots" #[name]="slotData">
                <slot :name="name" v-bind="slotData || {}"/>
            </template>
        </Multiselect>
        <AppError v-if="errors" :errors="errors" :field="field"/>
    </div>
</template>

<script>
import Multiselect from '@vueform/multiselect';
import AppError from '@/components/form/AppError.vue';

export default {
  components: {
    AppError,
    Multiselect,
  },
  props: {
    errors: {},
    label: {},
    modelValue: {},
    field: {},
    options: {},
    multiple: {},
    trackBy: {},
    labelField: {},
    customLabel: {},
    placeholder: {},
    loading: {},
    allowEmpty: { default: false },
    deselectLabel: { default: '' },
    selectLabel: { default: '' },
    selectedLabel: { default: '' },
    disabled: { default: false },
  },
  emits: ['update:modelValue', 'search-change'],
  methods: {
    onUpdate(value) {
      this.$emit('update:modelValue', value);
    },
  },
};
</script>
