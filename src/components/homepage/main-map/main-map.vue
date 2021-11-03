<template>
  <homepage-box class="main-map-box">
    <div class="main-map-wrapper">
      <map-filter-box class="map-filter-box" />
    </div>
  </homepage-box>
</template>

<script>
import HomepageBox from '../common/homepage-box/homepage-box';
import MapFilterBox from './map-filter-box/map-filter-box';
export default {
  name: 'MainMap',
  components: {MapFilterBox, HomepageBox}
};
</script>

<style scoped lang="less">
  @import "main-map";
</style>
