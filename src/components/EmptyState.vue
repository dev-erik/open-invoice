<template>
  <div :class="`col-12 text-muted text-${align}`">
    <small>{{ content || $t('empty-state:content') }}</small>
    <h4 class="mt-2">¯\_(ツ)_/¯</h4>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      default: null,
    },
    align: {
      default: 'center',
    },
  },
};
</script>
