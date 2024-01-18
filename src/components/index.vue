<template>
  <div
    class="wrapper"
  >
    <video src="./bg.mp4" class="bg" :controls="false" autoplay muted loop></video>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data(){
    return {
      list: [
        1, 2, 3, 4
      ]
    };
  },
  methods:{
    insert(){
      this.list.splice(1, 1, 4);
    }
  }
};
</script>

<style scoped lang="less">
  .wrapper{
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    .bg{
      width: 100%;
      height: 100%;
      object-fit:fill;
    }
  }
</style>
