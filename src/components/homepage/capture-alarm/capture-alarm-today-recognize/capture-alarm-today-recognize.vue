<template>
  <div class="capture-alarm-today-recognize">
    <face-alarm-item
      v-for="item of 10"
      :key="item"
    />
  </div>
</template>

<script>
import FaceAlarmItem from '../face-alarm-item/face-alarm-item';
export default {
  name: 'CaptureAlarmTodayRecognize',
  components: {FaceAlarmItem}
};
</script>

<style scoped lang="less">
  @import "capture-alarm-today-recognize";
</style>
