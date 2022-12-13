<template>
  <div>
    <h1>客户端</h1>
    <div>
      <p
        v-for="(message, index) in messages"
        :key="index"
      >
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Client',
  data(){
    return {
      ws: null,
      messages: []
    };
  },
  mounted() {
    var ws = new WebSocket('ws://www.linchaoqun.com:3000/client');

    ws.onopen = ()=>
    {
      this.log('已连接...');
    };

    ws.onmessage = (evt)=>
    {
      this.log(`数据已接收：${evt.data}`);
    };

    ws.onclose = ()=>
    {
      // 关闭 websocket
      this.log('连接已关闭...');
    };
    this.ws = ws;
  },
  methods:{
    log(msg){
      this.messages.push(msg);
    },
    submit(){

    }
  }
};
</script>

<style scoped>

</style>
