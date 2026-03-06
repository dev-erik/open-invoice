<template>
    <div class="invalid-feedback" v-if="errors.has(field)">
        <template v-for="(error, idx) in errors.get(field)" :key="idx">
            {{ error }} <br>
        </template>
    </div>
</template>

<script>
export default {
  props: {
    errors: { required: true },
    field: { required: true },
  },
};
</script>
