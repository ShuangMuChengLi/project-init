<template>
  <div>
    <el-form
      inline
      class="form row"
    >
      <el-form-item
        v-if="!isHide"
        label="更新频率： "
      >
        <el-input
          v-model="second"
          @change="setTimer"
        />
      </el-form-item>
      <el-form-item
        :label="!isHide? '下次刷新：': ''"
      >
        <span @click="showChart">{{ next }}</span>
      </el-form-item>
      <el-form-item
        class="right"
        :class="{isHide: isHide}"
      >
        <span class="label">当日盈亏：</span>
        <span
          class="number"
          :class="{green: profit < 0, red: profit > 0}"
          @click="hide"
        >{{ profit }}</span>
        <span
          class="number percentage"
          :class="{green: profit < 0, red: profit > 0}"
          @click="hide"
        >({{ percentage }})</span>
      </el-form-item>
    </el-form>
    <div
      v-show="isShowChart"
      id="chart"
      class="chart"
    />
    <el-table
      v-if="!isHide"
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        v-for="(item) in column"
        :key="Math.random() + item.prop"
        :label="item.label"
        :width="item.width || '120px'"
      >
        <template slot-scope="scope">
          <span
            :class="{
              current: getCurrent(scope.row, item),
              red: scope.row.percent > 0 && (item.prop === 'percentLabel'),
              green: scope.row.percent < 0 && (item.prop === 'percentLabel'),
            }"
          >{{ getLabel(scope.row, item) }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import * as echarts from 'echarts';
import {storageUtil} from '../../js/tools/storage-util/storage-util';
export default {
  name: 'VueTest',
  data () {
    return {
      isShowChart: false,
      isHide: true,
      tableData: [],
      column: [],
      levelList: [],
      second: 15,
      timer: null,
      next: 0,
      levels: 4,
      step: 15,
      profit: 0,
      line: [],
      lineX: [],
      myChart: null,
      now: null,
      percentage: null
    };
  },
  computed:{
    isOpen(){
      return this.now.isBetween(
        moment().set('hour', 9).set('minute', 15).set('second', 0),
        moment().set('hour', 9).set('minute', 25).set('second', 0),
      ) || this.now.isBetween(
        moment().set('hour', 9).set('minute', 30).set('second', 0),
        moment().set('hour', 11).set('minute', 30).set('second', 0),
      ) ||
        this.now.isBetween(
          moment().set('hour', 13).set('minute', 0).set('second', 0),
          moment().set('hour', 15).set('minute', 0).set('second', 0),
        );
    }
  },
  async mounted () {
    this.now = moment();
    this.line = await axios.get('http://localhost:3000/data?name=' + moment().format('YYYY-MM-DD')).then((res)=>{
      return res.data.data;
    }).catch(err=>false) || [];
    await this.baseToLevel();

    await this.init();
    this.setTimer();
  },
  methods: {
    hide(){
      this.isHide = !this.isHide;
    },
    setTimer(){
      clearInterval(this.timer);
      this.next = this.second;
      this.timer = setInterval(()=>{
        this.now = moment();
        if(this.next === 0){
          this.next = this.second;
          if(!this.isOpen)return;

          this.init();
        }else{
          this.next--;
        }
      }, 1000);
    },
    showChart(){
      this.isShowChart = !this.isShowChart;
      if(this.isShowChart){
        this.$nextTick(()=>{
          this.initChart(this.line);
        });
      }
    },
    initChart(data){
      if(!this.myChart){
        this.myChart = echarts.init(document.getElementById('chart'));
      }
      // 基于准备好的dom，初始化echarts实例

      // 指定图表的配置项和数据
      var option = {
        xAxis: {
          type: 'category',
          data: data.map(item=>item.time)
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: data.map(item=>item.profit),
            showSymbol: false,
            type: 'line',
            smooth: true
          }
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      this.myChart.setOption(option);
    },
    async init () {
      let url = '/v5/stock/realtime/quotec.json?symbol=';
      let arr = this.levelList.map(item=>`${item.prevCode}${item.code}`);
      let data = await axios.get(url + arr.join(','))
        .then((res)=>{
          return (res.data.data);
        })
        .catch((e)=>{console.error(e);});
      for(let dataItem of data){
        dataItem.symbol = dataItem.symbol.replace('SZ', '');
        dataItem.symbol = dataItem.symbol.replace('SH', '');
      }
      if(_.isEmpty(this.column)){
        this.column.push({
          label: '名称',
          prop: 'name',
          width: '120px'
        });
        this.column.push({
          label: '涨跌幅',
          prop: 'percentLabel',
          width: '120px'
        });
        this.column.push({
          label: '-',
          prop: 'p0'
        });
        for(let i = 0; i < this.levelList[0].list.length; i++){
          this.column.push({
            label: -this.levels * this.step + this.step * i + '%',
            prop: 'p' + (2 * i + 1)
          });
          this.column.push({
            label: '-',
            prop: 'p' + (2 * i + 2)
          });
        }
      }

      for(let levelItem of this.levelList){
        let currentData = _.find(data, {symbol: levelItem.code});
        if(!currentData)continue;

        let setCurrentEnd = false;
        levelItem['percentLabel'] = currentData.percent + '%';
        levelItem['percent'] = currentData.percent;
        levelItem['p0'] = '';
        levelItem['profit'] = currentData.chg * levelItem.count;
        levelItem['lastCloseValue'] = currentData.last_close * levelItem.count;
        for(let i = 0; i < levelItem.list.length; i++){
          levelItem['p' + (2 * i + 1)] = levelItem.list[i];
          if(currentData.current < levelItem.list[i + 1] && !setCurrentEnd){
            setCurrentEnd = true;
            levelItem['p' + (2 * i + 2)] = currentData.current;
          }else{
            levelItem['p' + (2 * i + 2)] = '';
          }
        }
        if(currentData.current < levelItem.alarmValue && levelItem.current > levelItem.alarmValue){
          levelItem.alarm = true;
        }
      }
      this.tableData = _.orderBy(this.levelList, ['percent'], ['desc']);

      this.profit = _.reduce(this.levelList, function(sum, n) {
        return sum + n.profit;
      }, 0);
      let lastCloseValue = _.reduce(this.levelList, function(sum, n) {
        return sum + n.lastCloseValue;
      }, 0);
      console.log(lastCloseValue);
      this.percentage = _.ceil(this.profit / lastCloseValue * 100, 2) + '%';
      if(this.isOpen){
        this.line.push({
          profit: this.profit,
          time: moment().format('HH:mm:ss')
        });
        axios.post('http://localhost:3000/data', {name: moment().format('YYYY-MM-DD'), data: this.line});
      }

      document.title = this.profit;
      if(this.isShowChart){
        this.initChart(this.line);
      }
    },
    async baseToLevel(){
      let base = await axios.get('./base.json')
        .then((res)=>{
          return (res.data);
        })
        .catch((e)=>{console.error(e);});

      let rate = this.step * 0.01;
      let fn = (value)=>{
        let levelList = [];
        let d = value * rate;
        for(let i = -this.levels; i <= this.levels; i++){
          levelList.push(_.ceil(value + d * i, 2));
        }
        return levelList;
      };
      let getPosition = (value, levelList)=>{
        let position = 0;
        let prev = null;
        for(let i = 0; i < levelList.length; i++){
          let level = levelList[i];
          let d = Math.abs(value - level);
          if(prev === null){
            prev = d;
            continue;
          }

          if(d <= prev){
            prev = d;
            position = i;
            continue;
          }
        }
        return position;
      };
      let result = [];
      for(let item of base){
        let levelList = fn(item.base || _.last(item.history).value);
        let position = getPosition(item.history[0].value, levelList);
        result.push({
          ...item,
          name: `${item.name}`,
          current: levelList[position],
          currentCount: item.history[0].count,
          list: levelList,
          count: _.reduce(item.history, function(sum, n) {
            return sum + n.count;
          }, 0)
        });
      }
      this.levelList = result;
    },
    getLabel(row, item){
      if(row.current === row[item.prop]){
        return `${row[item.prop]} / ${row.currentCount}`;
      }else{
        return `${row[item.prop]}`;
      }
    },
    getCurrent(row, item){
      return row.current === row[item.prop];
    },
  }
};
</script>

<style scoped lang="less">
.alarm, .red{
  color: red;
}
.green{
  color: green;
}
.space{
  //color: red;
}
.current{
  color: #0000ff;
}
.form{
  width: 100%;
}
.row{
  margin: 10px;
}
.right{
  float: right;
  margin-right: 100px;
}
.number{
  font-size: 40px;
  margin-right: 20px;
}
.isHide{
  float: unset;
  display:block;
  .label{
    display: none;
  }
}
.chart{
  width: 100%;
  height: 500px;
}
.percentage{
  font-size: 20px;
}
</style>

