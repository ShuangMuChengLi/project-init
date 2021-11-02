<template>
  <homepage-box class="capture-alarm">
    <div class="capture-alarm-wrapper">
      <div class="capture-alarm-header">
        <div class="tab-wrapper">
          <div
            v-for="(item, index) in tabList"
            :key="index"
            class="tab-item "
            :class="{ active: index === current }"
            @click="current = index"
          >
            <span class="tab-item-text">{{ item.label }}（{{ item.count || 0 }}）</span>
          </div>
        </div>
        <div class="btn-wrapper">
          <i
            class="el-icon-more"
            title="查看更多"
          />
          <i
            class="el-icon-s-tools"
            title="设置"
          />
        </div>
      </div>
      <div class="capture-alarm-body">
        <capture-alarm-today-alarm v-show="current === 0" />
        <capture-alarm-today-recognize v-show="current === 1" />
      </div>
    </div>
  </homepage-box>
</template>

<script>
import HomepageBox from '../common/homepage-box/homepage-box';
import CaptureAlarmTodayAlarm from './capture-alarm-today-alarm/capture-alarm-today-alarm';
import CaptureAlarmTodayRecognize from './capture-alarm-today-recognize/capture-alarm-today-recognize';
export default {
  name: 'CaptureAlarm',
  components: {CaptureAlarmTodayRecognize, CaptureAlarmTodayAlarm, HomepageBox},
  data() {
    return {
      current: 0,
      tabList: [
        {
          label: '今日告警',
          count: 1
        },
        {
          label: '今日识别',
          count: 2
        },
      ]
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
};
</script>

<style scoped lang="less">
  @import "./capture-alarm";
</style>
