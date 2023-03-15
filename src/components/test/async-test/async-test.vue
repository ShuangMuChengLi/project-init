<template>
  <div>
    <el-button
      type="primary"
      @click="load"
    >
      加载
    </el-button>
    <component :is="comp" />
  </div>
</template>

<script>
export default {
  name: 'AsyncTest',
  components:{
    'vue-test': () => import('./async-test-data')
  },
  data(){
    return {
      comp: null
    };
  },
  methods:{
    load(){
      this.comp = 'vue-test';
    }
  }
};
</script>

<style scoped>

</style>
