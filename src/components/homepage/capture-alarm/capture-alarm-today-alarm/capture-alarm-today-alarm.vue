<template>
  <div class="today-alarm">
    <el-collapse
      v-model="active"
      class="collapse"
      accordion
    >
      <el-collapse-item name="1">
        <template slot="title">
          <div class="face-alarm-title">
            <div class="title-wrapper">
              <i class="face-icon" />
              <span>人脸告警</span>
            </div>
            <div class="color-rule-wrapper">
              <div class="color-rule-item one">
                <i class="color-point" />
                <span class="text">一级</span>
              </div>
              <div class="color-rule-item second">
                <i class="color-point" />
                <span class="text">二级</span>
              </div>
              <div class="color-rule-item third">
                <i class="color-point" />
                <span class="text">三级</span>
              </div>
            </div>
          </div>
        </template>
        <div class="face-alarm-list">
          <div class="face-alarm-item">
            <div class="photo">
              <el-image :src="demoImg" />
            </div>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="反馈 Feedback">
        <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
        <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import demoImg from '../images/demo-photo.png';
export default {
  name: 'CaptureAlarmTodayAlarm',
  data(){
    return {
      active: '1'
    };
  }
};
</script>

<style scoped lang="less">
  @import "./capture-alarm-today-alarm";
</style>
