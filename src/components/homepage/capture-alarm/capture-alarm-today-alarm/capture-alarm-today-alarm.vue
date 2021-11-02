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
              <div class="color-rule-item first">
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
          <face-alarm-item
            v-for="item of 10"
            :key="item"
          />
        </div>
      </el-collapse-item>
      <el-collapse-item
        name="2"
      >
        <template slot="title">
          <div class="face-alarm-title">
            <div class="title-wrapper">
              <i class="warn-icon" />
              <span>陀螺仪告警</span>
            </div>
          </div>
        </template>
        <div class="device-warn-list">
          <div class="device-warn-item">
            <p>
              <span class="name">告警类型：</span>
              <type-text data="倒地告警" />
            </p>
            <p>
              <span class="name">记录仪名称:</span>
              <span class="link">市局111</span>
            </p>
            <p>
              <span class="name">所属派出所：</span>
              <span class="value">思明分局中华派出所</span>
            </p>
            <p>
              <span class="name">告警时间：</span>
              <span class="value">2021-10-19 18:40:43</span>
            </p>
          </div>
          <div class="device-warn-item">
            <p>
              <span class="name">告警类型：</span>
              <type-text data="倒地告警" />
            </p>
            <p>
              <span class="name">记录仪名称:</span>
              <span class="link">市局111</span>
            </p>
            <p>
              <span class="name">所属派出所：</span>
              <span class="value">思明分局中华派出所</span>
            </p>
            <p>
              <span class="name">告警时间：</span>
              <span class="value">2021-10-19 18:40:43</span>
            </p>
          </div>
          <div class="device-warn-item">
            <p>
              <span class="name">告警类型：</span>
              <type-text data="倒地告警" />
            </p>
            <p>
              <span class="name">记录仪名称:</span>
              <span class="link">市局111</span>
            </p>
            <p>
              <span class="name">所属派出所：</span>
              <span class="value">思明分局中华派出所</span>
            </p>
            <p>
              <span class="name">告警时间：</span>
              <span class="value">2021-10-19 18:40:43</span>
            </p>
          </div>
          <div class="device-warn-item">
            <p>
              <span class="name">告警类型：</span>
              <type-text data="倒地告警" />
            </p>
            <p>
              <span class="name">记录仪名称:</span>
              <span class="link">市局111</span>
            </p>
            <p>
              <span class="name">所属派出所：</span>
              <span class="value">思明分局中华派出所</span>
            </p>
            <p>
              <span class="name">告警时间：</span>
              <span class="value">2021-10-19 18:40:43</span>
            </p>
          </div>
          <div class="device-warn-item">
            <p>
              <span class="name">告警类型：</span>
              <type-text data="倒地告警" />
            </p>
            <p>
              <span class="name">记录仪名称:</span>
              <span class="link">市局111</span>
            </p>
            <p>
              <span class="name">所属派出所：</span>
              <span class="value">思明分局中华派出所</span>
            </p>
            <p>
              <span class="name">告警时间：</span>
              <span class="value">2021-10-19 18:40:43</span>
            </p>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import demoImg from '../images/demo-photo.png';
import TypeText from '../../common/type-text/type-text';
import FaceAlarmItem from '../face-alarm-item/face-alarm-item';
export default {
  name: 'CaptureAlarmTodayAlarm',
  components: {FaceAlarmItem, TypeText},
  data(){
    return {
      active: '1',
    };
  }
};
</script>

<style scoped lang="less">
  @import "./capture-alarm-today-alarm";
</style>
