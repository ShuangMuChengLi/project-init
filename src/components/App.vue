<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {

  },
  mounted(){
    console.log('app mounted');
  }
};
</script>

<style>
</style>
