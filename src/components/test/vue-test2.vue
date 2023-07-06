<template>
  <div class="root">
    <div
      id="chart"
      class="chart"
    />
  </div>
</template>

<script>
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import * as echarts from 'echarts';
import list from '../../../js-test/model-by-time-middle2013-buildAll/changedList.json';
import { rkMath } from '../../js/tools/rk-math';
import val from '../../../js-test/export-test/index';
export default {
  name: 'SkuSelector',
  data() {
    return {

    };
  },
  computed: {},
  mounted() {
    this.initChart();
    console.log(val);
  },
  methods: {
    initChart(){
      // let index = _.findIndex(list, {date: '2018-06-21'});
      // // let index = _.findIndex(list, {date: '2013-06-21'});
      // console.log(index);
      let data = list;
      // let data = list.slice(index);
      if(!this.myChart){
        this.myChart = echarts.init(document.getElementById('chart'));
      }
      // 基于准备好的dom，初始化echarts实例

      // 指定图表的配置项和数据
      var option = {
        xAxis: {
          type: 'category',
          data: data.map(item=>item.date)
        },
        yAxis: {
          type: 'value'
        },
        tooltip: {
          trigger: 'axis',
          // axisPointer: {
          //   type: 'cross',
          //   label: {
          //     backgroundColor: '#6a7985'
          //   }
          // }
        },
        series: [
          {
            name: 'base',
            data: data.map(item=>item.base),
            showSymbol: false,
            type: 'line',
            smooth: true
          },
          {
            name: 'targetValue',
            data: data.map(item=>item.targetValue),
            showSymbol: false,
            type: 'line',
            smooth: true
          },
          {
            name: '值',
            data: data.map(item=>item.value),
            showSymbol: false,
            type: 'line',
            smooth: true
          },
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      this.myChart.setOption(option);
    },
  },
};
</script>

<style>
.chart{
  width: 100%;
  height: 500px;
}
</style>

