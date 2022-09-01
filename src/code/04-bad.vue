<template>
  <div>
    <h1 v-if="arg1 === 1 && arg2 === 2 && arg3 - arg2 === arg1 && arg4 !== arg3 + arg2" style="color: #000">标题</h1>
  </div>
</template>

<script>
export default {
  name: '04Bad',
  data(){
    return {
      arg1: 1,
      arg2: 2,
      arg3: 3,
      arg4: 4,
    };
  }
};
</script>

<style scoped>

</style>
