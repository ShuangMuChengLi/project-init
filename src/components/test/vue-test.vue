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
    <div
      v-if="!isHide"
      class="table-wrapper"
    >
      <el-table
        :data="tableData"
        :cell-style="{height: '20px', padding: '1px 0'}"
        class="left-table"
      >
        <el-table-column
          v-for="(item) in column"
          :key="Math.random() + item.prop"
          :label="item.label"
          :width="item.width || '120px'"
        >
          <template
            slot-scope="scope"
          >
            <span
              :class="getRowItemClass(scope.row, item)"
            >{{ getLabel(scope.row, item) }}</span>
          </template>
        </el-table-column>
      </el-table>

      <el-table
        :data="totalList"
        class="right-table"
        :cell-style="{height: '20px', padding: '5px 0'}"
      >
        <el-table-column
          label="行业"
          :width="'120px'"
          prop="type"
        />
        <el-table-column
          label="持仓"
          :width="'120px'"
          prop="total"
        />
        <el-table-column
          label="当日盈亏"
          :width="'120px'"
          prop="profit"
        >
          <template slot-scope="scope">
            <span
              :class="{
                red: scope.row.profit > 0,
                green: scope.row.profit < 0,
              }"
            >{{ scope.row.profit }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="涨跌幅"
          :width="'120px'"
          prop="percentLabel"
        >
          <template slot-scope="scope">
            <span
              :class="{
                red: scope.row.profit > 0,
                green: scope.row.profit < 0,
              }"
            >{{ scope.row.percentLabel }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import * as echarts from 'echarts';

export default {
  name: 'VueTest',
  data () {
    return {
      isShowChart: false,
      isHide: true,
      tableData: [],
      column: [],
      levelList: [],
      totalList: [],
      second: 5,
      timer: null,
      next: 0,
      step: 20,
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
      return this.now.day() > 0 && this.now.day() < 6 && (this.now.isBetween(
        moment().set('hour', 9).set('minute', 15).set('second', 0),
        moment().set('hour', 9).set('minute', 25).set('second', 0),
      ) || this.now.isBetween(
        moment().set('hour', 9).set('minute', 30).set('second', 0),
        moment().set('hour', 11).set('minute', 35).set('second', 0),
      ) ||
        this.now.isBetween(
          moment().set('hour', 13).set('minute', 0).set('second', 0),
          moment().set('hour', 15).set('minute', 5).set('second', 0),
        ));
    }
  },
  async mounted () {
    var object = { 'a': [{ 'b': { 'c': 3 } }] };
    console.log(_.get(object, 'a[0].b.c'));
    this.now = moment();
    this.line = await axios.get('http://localhost:3000/data?name=' + moment().format('YYYY-MM-DD')).then((res)=>{
      return res.data.data;
    }).catch(err=>false) || [];
    await this.getBaseData();

    await this.init();
    this.setTimer();
  },
  methods: {
    getRowItemClass(row, item){
      return {
        red: row.percent > 0 && (['percentLabel', 'profitLabel', 'current'].includes(item.prop))
        || item.prop === 'marginPrice' && row.marginPrice > row.current
        || item.prop === 'target' && row.target < row.current
        || item.prop === 'stopProfitPrice' && row.stopProfitPrice < row.current,
        green: row.percent < 0 && (['percentLabel', 'profitLabel', 'current'].includes(item.prop)),
      };
    },
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
            name: '收益',
            data: data.map(item=>item.profit),
            showSymbol: false,
            type: 'line',
            smooth: true
          },
          {
            name: '沪深300',
            data: data.map(item=>{
              return item.baseProfit || 0;
            }),
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
          label: '当日盈利',
          prop: 'profitLabel',
          width: '120px'
        });
        this.column.push({
          label: '现价',
          prop: 'current',
          width: '120px'
        });
        this.column.push({
          label: '待补仓价',
          prop: 'marginPrice',
          width: '120px'
        });
        this.column.push({
          label: '止盈价',
          prop: 'stopProfitPrice',
          width: '120px'
        });
        this.column.push({
          label: '目标价',
          prop: 'target',
          width: '120px'
        });
        this.column.push({
          label: '持仓',
          prop: 'total',
          width: '120px'
        });
        this.column.push({
          label: '行业',
          prop: 'type',
          width: '120px'
        });
      }

      let typeSet = {};
      for(let levelItem of this.levelList){
        let currentData = _.find(data, {symbol: levelItem.code});
        if(!currentData)continue;

        levelItem.count = _.reduce(levelItem.history, function(sum, n) {
          return sum + n.count;
        }, 0);
        levelItem['marginPrice'] = levelItem.marginPrice || _.floor(levelItem.history[0].value * 0.8, 2);
        levelItem['stopProfitPrice'] = levelItem.stopProfitPrice || _.floor(levelItem.history[0].value * 1.2, 2);
        levelItem['percentLabel'] = currentData.percent + '%';
        levelItem['percent'] = currentData.percent;
        levelItem['type'] = levelItem.type;
        levelItem['target'] = levelItem.target || '';
        levelItem['current'] = currentData.current;
        levelItem['profit'] = currentData.chg * levelItem.count;
        levelItem['profitLabel'] = _.floor(currentData.chg * levelItem.count, 2);
        levelItem['lastCloseValue'] = currentData.last_close * levelItem.count;
        levelItem['total'] = _.floor(currentData.current * levelItem.count);
        if(typeSet[levelItem.type]){
          typeSet[levelItem.type].total += levelItem['total'];
          typeSet[levelItem.type].profit += levelItem['profit'];
        }else{
          typeSet[levelItem.type] = {
            total: levelItem['total'],
            profit: levelItem['profit'],
          };
        }
      }
      let totalList = [];
      for(let type in typeSet){
        totalList.push({
          type: type,
          total: _.floor(typeSet[type].total),
          profit: _.floor(typeSet[type].profit),
          percentLabel: _.floor(typeSet[type].profit / typeSet[type].total * 100, 2) + '%',
        });
      }
      this.totalList = totalList.sort((a, b)=>b.profit - a.profit);
      this.tableData = _.orderBy(this.levelList, ['profit'], ['desc']);

      this.profit = _.floor(_.reduce(this.levelList, function(sum, n) {
        return sum + n.profit;
      }, 0));
      let lastCloseValue = _.reduce(this.levelList, function(sum, n) {
        return sum + n.lastCloseValue;
      }, 0);
      this.percentage = _.ceil(this.profit / lastCloseValue * 100, 2) + '%';
      if(this.isOpen){
        let baseProfit = _.floor((_.find(data, {symbol: '510310'})?.percent || 0) / 100 * lastCloseValue);
        this.line.push({
          profit: this.profit,
          baseProfit: baseProfit,
          time: moment().format('HH:mm:ss')
        });
        axios.post('http://localhost:3000/data', {name: moment().format('YYYY-MM-DD'), data: this.line});
      }

      document.title = this.profit;
      if(this.isShowChart){
        this.initChart(this.line);
      }
    },
    async getBaseData(){
      this.levelList = await axios.get('./base.json')
        .then((res) => {
          return (res.data);
        })
        .catch((e) => {
          console.error(e);
        });
    },
    getLabel(row, item){
      return `${row[item.prop]}`;
    },
    getCurrent(row, item){
      return row.current === row[item.prop];
    },
  }
};
</script>

<style scoped lang="less">
@import "vue-test";
</style>

