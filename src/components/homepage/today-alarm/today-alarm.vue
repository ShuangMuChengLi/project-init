<template>
  <homepage-box class="today-alarm-wrapper">
    <header class="today-alarm-header">
      今日警情（113）
    </header>
    <div class="today-alarm-list">
      <div
        v-for="item in 10"
        :key="item"
        class="today-alarm-item">
        <p><span class="label">警情时间：</span><span class="value">2021-10-22  08:30:50</span></p>
        <p><span class="label">报警类型：</span><type-text data="刑事警情" /></p>
        <p><span class="label">警情编号：</span><span class="link">35021120211022500001</span></p>
        <p><span class="label">报警地址：</span><span class="value">福建省厦门市集美区杏林南路....</span></p>
        <p><span class="label">所属派出所：</span><span class="value">杏林派出所</span></p>
        <p><span class="label">出警民警：</span><span class="value">张三（D001)</span></p>
      </div>
    </div>
  </homepage-box>
</template>

<script>
import HomepageBox from '../common/homepage-box/homepage-box';
import TypeText from '../common/type-text/type-text';
export default {
  name: 'TodayAlarm',
  components: {TypeText, HomepageBox}
};
</script>

<style scoped lang="less">
  @import "today-alarm";
</style>
