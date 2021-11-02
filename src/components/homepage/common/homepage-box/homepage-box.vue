<template>
  <div class="homepage-box">
    <div class="left-top" />
    <div class="left-bottom" />
    <div class="right-top" />
    <div class="right-bottom" />
    <div class="homepage-box-main">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomepageBox'
};
</script>

<style scoped lang="less">
  @import "homepage-box";
</style>
