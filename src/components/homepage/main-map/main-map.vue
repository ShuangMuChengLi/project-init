<template>
  <homepage-box class="main-map-box">
    <div class="main-map" />
  </homepage-box>
</template>

<script>
import HomepageBox from '../common/homepage-box/homepage-box';
export default {
  name: 'MainMap',
  components: {HomepageBox}
};
</script>

<style scoped lang="less">
  @import "main-map";
</style>
