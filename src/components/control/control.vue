<template>
  <div>
    <h1>控制台</h1>
    <div class="form-wrapper">
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
      >
        <el-form-item label="数据">
          <el-input
            v-model="form.info"
            type="textarea"
            :autosize="{ minRows: 10}"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submit"
          >
            发送
          </el-button>
        </el-form-item>
      </el-form>
    </div>
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
  name: 'Control',
  data(){
    return {
      ws: null,
      form:{
        info: null
      },
      messages: []
    };
  },
  mounted() {
    var ws = new WebSocket('ws://www.linchaoqun.com:3000/control');

    ws.onopen = ()=>
    {
      this.log('已连接...');
    };

    ws.onmessage = (evt)=>
    {
      this.log('数据已接收...');
    };

    ws.onclose = ()=>
    {
      this.log('连接已关闭...');
    };
    this.ws = ws;
  },
  methods:{
    log(msg){
      this.messages.push(msg);
    },
    submit(){
      let info = this.form.info;
      this.ws.send(JSON.stringify({
        type: 'broadcast',
        data: info
      }));
      this.log('数据已发送...');
    }
  }
};
</script>

<style scoped lang="less">
.form-wrapper{
  width: 500px;
}
</style>
