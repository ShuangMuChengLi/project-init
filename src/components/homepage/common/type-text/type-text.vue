<template>
  <p class="id-card">{{ data }}</p>
</template>

<script>
export default {
  name: 'TypeText',
  props: {
    data: {
      type: String,
      default: null
    }
  }
};
</script>

<style scoped lang="less">
  @import "type-text";
</style>
