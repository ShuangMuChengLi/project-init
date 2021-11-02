<template>
  <div class="homepage-wrapper">
    <homepage-header />
    <div class="main-body">
      <top-statistics />
      <div class="main-inner">
        <div class="main-left">
          <div class="main-left-top">
            <today-alarm class="today-alarm" />
          </div>
          <div class="main-left-bottom">
            <capture-list class="capture-list" />
          </div>
        </div>
        <div class="main-map-wrapper">
          <main-map />
        </div>
        <div class="main-right">
          <capture-alarm />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import TopStatistics from './top-statistics/top-statistics';
import HomepageHeader from './homepage-header/homepage-header';
import TodayAlarm from './today-alarm/today-alarm';
import CaptureList from './capture-list/capture-list';
import MainMap from './main-map/main-map';
import CaptureAlarm from './capture-alarm/capture-alarm';
export default {
  name: 'Homepage',
  components: {CaptureAlarm, MainMap, CaptureList, TodayAlarm, HomepageHeader, TopStatistics},
};
</script>

<style scoped lang="less">
  @import "homepage";
</style>
