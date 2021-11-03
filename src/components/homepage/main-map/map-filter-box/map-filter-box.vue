<template>
  <div
    class="filter-box"
    @click.stop
  >
    <div
      v-for="item in list"
      :key="item.value"
      class="filter-item"
    >
      <div
        class="filter-bar"
        @mouseover="barClick(item)"
      >
        <div class="filter-bar-body">
          <i
            class="filter-icon "
            :class="item.className"
          />
          <span class="text">{{ item.label }}</span>
        </div>
        <i class="el-icon-caret-bottom" />
      </div>
      <div
        v-if="current === item.value"
        class="filter-menu"
      >
        <div
          v-for="subItem in item.menu"
          :key="subItem.value"
          class="filter-menu-item"
        >
          <i
            class="filter-icon "
            :class="subItem.className"
          />
          <span class="text">{{ subItem.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MapFilterBox',
  data(){
    return {
      current: '',
      list: [
        {
          label: '告警',
          value: 'warn',
          className: 'warn',
          menu: [
            {
              label: '关闭',
              value: '0',
              className: 'warn disable'
            },
            {
              label: '开启',
              value: '1',
              className: 'warn'
            },
          ]
        },
        {
          label: '警情',
          value: 'police-alarm',
          className: 'police-alarm',
          menu: [
            {
              label: '关闭',
              value: '0',
              className: 'police-alarm disable'
            },
            {
              label: '一小时内',
              value: '1',
              className: 'police-alarm'
            },
            {
              label: '半天',
              value: '1',
              className: 'police-alarm'
            },
            {
              label: '24小时',
              value: '1',
              className: 'police-alarm'
            },
          ]
        },
        {
          label: '记录仪',
          value: 'police-device',
          className: 'police-device',
          menu: [
            {
              label: '关闭',
              value: '0',
              className: 'police-device disable'
            },
            {
              label: '开启',
              value: '1',
              className: 'police-device'
            },
          ]
        },
      ]
    };
  },
  mounted() {
    document.body.addEventListener('click', this.menuHide);
  },
  beforeDestroy() {
    document.body.removeEventListener('click', this.menuHide);
  },
  methods:{
    barClick(item){
      this.current = item.value;
    },
    menuHide(){
      this.current = null;
    }
  }
};
</script>

<style scoped lang="less">
  @import "map-filter-box";
</style>
