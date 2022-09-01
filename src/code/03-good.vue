<template />

<script>
export default {
  name: '03Good',
  data(){
    return {
      fn: null,
      timer: null
    };
  },
  mounded(){
    this.fn = ()=>{
      console.log('success');
    };
    document.addEventListener('click', this.fn);
    this.timer = setInterval(()=>{
      console.log('success');
    }, 1000);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.fn);
    clearInterval(this.timer);
  },
  methods:{

  }
};
</script>

<style scoped>

</style>
