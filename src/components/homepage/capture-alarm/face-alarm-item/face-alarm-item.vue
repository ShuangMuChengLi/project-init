<template>
  <div
    class="face-alarm-item"
  >
    <div class="photo">
      <el-image
        class="img"
        :src="demoImg"
      />
    </div>
    <div class="info-wrapper">
      <p class="row-first">
        <span class="name">汪屽永</span>
        <person-flag
          class="flag"
          data="毒|前科,治|历史在逃"
          :limit="1"
        />
      </p>
      <p class="similarity">
        相似度：90.95%
      </p>
      <p class="similarity">
        <id-card data="35010319555545454" />
      </p>
      <p>
        时间：2021-10-19    18:40:43
      </p>
    </div>
  </div>
</template>

<script>
import PersonFlag from '../../common/person-flag/person-flag';
import demoImg from '../images/demo-photo.png';
import IdCard from '../../common/id-card/id-card';
export default {
  name: 'FaceAlarmItem',
  components: {IdCard, PersonFlag},
  data(){
    return {
      demoImg
    };

  }
};
</script>

<style scoped lang="less">
  @import "face-alarm-item";
</style>
