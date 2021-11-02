<template>
  <div class="person-flag">
    <div
      v-for="(item, key) in resultList"
      :key="key"
      class="person-flag-item"
    >
      {{ item.front }} | {{ item.back }}
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
export default {
  name: 'PersonFlag',
  props: {
    data: {
      type: String,
      default: ''
    },
    limit: {
      type: Number,
      default: null
    }
  },
  data(){
    return {
      flagList: []
    };
  },
  computed: {
    resultList (){
      if(!this.limit){
        return this.flagList;
      }

      return _.take(this.flagList, this.limit);
    }
  },
  watch:{
    data:{
      handler(val){
        if(!val){
          this.flagList = [];
          return;
        }

        let flagList = val.split(',');
        for(let item of flagList){
          let flagItem = item.split('|');
          this.flagList.push({
            front: flagItem[0],
            back: flagItem[1],
          });
        }
      },
      immediate: true
    }
  }
};
</script>

<style scoped lang="less">
  @import "person-flag";
</style>
