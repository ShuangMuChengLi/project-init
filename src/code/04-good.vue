<template>
  <div>
    <h1
      v-if="isHeaderVisible"
      class="header"
    >
      标题
    </h1>
  </div>
</template>

<script>
export default {
  name: '04Good',
  data(){
    return {
      arg1: 1,
      arg2: 2,
      arg3: 3,
      arg4: 4,
    };
  },
  computed:{
    isHeaderVisible(){
      return this.arg1 === 1 &&
        this.arg2 === 2 &&
        this.arg3 - this.arg2 === this.arg1 &&
        this.arg4 !== this.arg3 + this.arg2;
    }
  }
};
</script>

<style scoped lang="less">
  .header{
    color: #000;
  }
</style>
