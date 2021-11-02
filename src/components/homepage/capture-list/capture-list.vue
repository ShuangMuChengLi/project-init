<template>
  <homepage-box class="capture-list-wrapper">
    <header class="header">
      今日警情（113）
    </header>
    <div class="list">
      <div
        v-for="item in 10"
        :key="item"
        class="item"
      >
        <div>
          <el-image
            class="img"
            :src="demoImg"
            fit="contain"
          />
        </div>
        <p class="info">
          <span class="important">李庆昆（240016）</span>
          <span>2021-10-22  08:30:50</span>
        </p>
      </div>
    </div>
  </homepage-box>
</template>

<script>
import HomepageBox from '../common/homepage-box/homepage-box';
import demoImg from '../images/capture-demo.png';
export default {
  name: 'CaptureList',
  components: {HomepageBox},
  data(){
    return {
      demoImg
    };
  }
};
</script>

<style scoped lang="less">
  @import "capture-list";
</style>
