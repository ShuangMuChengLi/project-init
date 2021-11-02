<template>
  <div class="statistics-wrapper">
    <homepage-box class="statistics-left">
      <div class="statistics-inner">
        <div class="statistics-item">
          <p class="label">
            执法记录仪总数
          </p>
          <p class="value orange">
            <span class="number">260</span>  台
          </p>
        </div>
        <div class="statistics-item">
          <p class="label">
            在线数
          </p>
          <p class="value blue">
            <span class="number">260</span>  台
          </p>
        </div>
        <div class="statistics-item">
          <p class="label">
            出警数
          </p>
          <p class="value green">
            <span class="number">260</span>  台
          </p>
        </div>
      </div>
    </homepage-box>
    <homepage-box class="statistics-right">
      <div class="statistics-inner">
        <div class="statistics-item">
          <p class="label">
            执法记录仪总数
          </p>
          <p class="value orange">
            <span class="number">260</span>  台
          </p>
        </div>
        <div class="statistics-item">
          <p class="label">
            在线数
          </p>
          <p class="value orange">
            <span class="number">260</span>  台
          </p>
        </div>
        <div class="statistics-item">
          <p class="label">
            出警数
          </p>
          <p class="value orange">
            <span class="number">260</span>  台
          </p>
        </div>
        <div class="statistics-item">
          <p class="label">
            执法记录仪总数
          </p>
          <p class="value orange">
            <span class="number">260</span>  台
          </p>
        </div>
        <div class="statistics-item">
          <p class="label">
            在线数
          </p>
          <p class="value orange">
            <span class="number">260</span>  台
          </p>
        </div>
        <div class="statistics-item">
          <p class="label">
            出警数
          </p>
          <p class="value orange">
            <span class="number">260</span>  台
          </p>
        </div>
      </div>
    </homepage-box>
  </div>
</template>

<script>
import HomepageBox from '../common/homepage-box/homepage-box';
export default {
  name: 'TopStatistics',
  components: {HomepageBox}
};
</script>

<style scoped lang="less">
  @import "top-statistics";
</style>
