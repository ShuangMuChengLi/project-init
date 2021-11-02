<template>
  <p class="id-card">{{ data }}</p>
</template>

<script>
export default {
  name: 'IdCard',
  props: {
    data: {
      type: String,
      default: null
    }
  }
};
</script>

<style scoped lang="less">
  @import "id-card";
</style>
