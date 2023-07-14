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
        :default-sort="{prop: 'percentLabel', order: 'descending'}"
      >
        <el-table-column
          v-for="(item) in column"
          :key="item.prop"
          :label="item.label"
          :width="item.width"
          :prop="item.prop"
          sortable
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
        v-if="false"
        :data="totalList"
        class="right-table"
        :cell-style="{height: '20px', padding: '5px 0'}"
        :default-sort="{prop: 'percentLabel', order: 'descending'}"
      >
        <el-table-column
          label="行业"

          prop="type"
        />
        <el-table-column
          label="持仓"

          prop="total"
          sortable
        />
        <el-table-column
          label="仓位%"

          prop="accountPercentage"
          sortable
        />
        <el-table-column
          label="当日盈亏"

          prop="profit"
          sortable
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

          prop="percentLabel"
          sortable
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
    <div
      v-show="!isHide"
      id="historyChart"
      class="chart"
    />
  </div>
</template>

<script>
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import * as echarts from 'echarts';
import { rkMath } from '../../js/tools/rk-math';
import {getHistoryData, getLibRate} from './getTargetLib';

export default {
  name: 'VueTest',
  data () {
    return {
      money: 0,
      isShowChart: false,
      isHide: true,
      tableData: [],
      column: [],
      levelList: [],
      totalList: [],
      second: 5,
      timer: null,
      next: 0,
      step: 2,
      profit: 0,
      line: [],
      lineX: [],
      myChart: null,
      historyChart: null,
      historyInfo: [],
      now: null,
      percentage: null,
      totalValue: 0,
      referenceValue: 0,
      markPb: null
    };
  },
  computed:{
    isOpen(){
      return this.now.day() > 0 && this.now.day() < 6 && this.now.isBetween(
        moment().set('hour', 9).set('minute', 15).set('second', 0),
        moment().set('hour', 15).set('minute', 5).set('second', 0),
      );
    }
  },
  async mounted () {


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
    async hide(){
      this.isHide = !this.isHide;
      if(!this.isHide){
        await this.$nextTick();

        this.initHistoryChart();

      }
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
    initHistoryChart(){
      if(!this.historyChart){
        this.historyChart = echarts.init(document.getElementById('historyChart'));
      }
      // 基于准备好的dom，初始化echarts实例
      // 指定图表的配置项和数据
      let markIndex = _.findIndex(this.historyInfo, {'key': this.markPb + ''});
      let mark = this.historyInfo[markIndex];
      var option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter:  (param)=>{
            return `
            <div>pb：${param[0].data.key}</div>
            <div>数量：${param[0].data.value}</div>
            <div>价格：${param[0].data.price}</div>
          `;
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.historyInfo.map(item=>item.key),
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '天数',
            type: 'bar',
            barWidth: '60%',
            data: this.historyInfo,
            markPoint: {
              itemStyle: {
                color: '#B03A5B'
              },
              data: [
                {
                  name: 'Max',
                  value: mark.price,
                  xAxis: markIndex,
                  yAxis: mark.value
                }
              ]
            },
          }
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      this.historyChart.setOption(option);
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
        });
        this.column.push({
          label: '涨跌幅',
          prop: 'percentLabel',
        });
        this.column.push({
          label: '当日盈利',
          prop: 'profitLabel',
        });
        this.column.push({
          label: 'floorPrice',
          prop: 'floorPrice',
        });
        this.column.push({
          label: '现价',
          prop: 'current',
        });
        this.column.push({
          label: 'ceilPrice',
          prop: 'ceilPrice',
        });

        this.column.push({
          label: 'pb',
          prop: 'pb',
        });
        /**
         * this.$set(levelItem, 'floorPrice', floorPrice);
         this.$set(levelItem, 'ceilPrice', ceilPrice);
         */
        // this.column.push({
        //   label: '待补仓价',
        //   prop: 'marginPrice',
        // });
        // this.column.push({
        //   label: '止盈价',
        //   prop: 'stopProfitPrice',
        // });
        // this.column.push({
        //   label: '目标价格',
        //   prop: 'target',
        // });
        // this.column.push({
        //   label: '目标空间',
        //   prop: 'space',
        //   width: '120px'
        // });
        this.column.push({
          label: '交易数量',
          prop: 'marginCount',
        });
        this.column.push({
          label: '交易价格',
          prop: 'marginValue',
        });
        this.column.push({
          label: '目标仓位',
          prop: 'targetRate',
        });
        this.column.push({
          label: '当前仓位',
          prop: 'currentRate',
        });
        this.column.push({
          label: '持仓',
          prop: 'total',
        });
        // this.column.push({
        //   label: '仓位',
        //   prop: 'accountPercentage',
        // });
        // this.column.push({
        //   label: '行业',
        //   prop: 'type',
        // });
      }
      for(let levelItem of this.levelList){
        levelItem.count = _.reduce(levelItem.history, function(sum, n) {
          return sum + n.count;
        }, 0);
      }
      this.totalValue = _.reduce(this.levelList, (sum, n)=> {
        let currentData = _.find(data, {symbol: n.code});
        if(!currentData){
          console.log(data, n.code);
          return sum;
        }
        return sum + _.floor(currentData.current * n.count);
      }, 0);
      let totalLib = (this.totalValue + this.money);
      let typeSet = {};
      function getThousand(n){
        return _.floor(n / 1000) * 1000;
      }
      function getHundred(n){
        return _.floor(n / 100) * 100;
      }
      for(let levelItem of this.levelList){
        let currentData = _.find(data, {symbol: levelItem.code});
        if(!currentData)continue;

        levelItem['marginCount'] = '-';
        levelItem['marginValue'] = '-';
        levelItem['targetRate'] = '-';
        levelItem['currentRate'] = '-';
        levelItem['marginPrice'] = levelItem.marginPrice || _.floor(levelItem.history[0].value * (1 - this.step / 100), 3);
        levelItem['stopProfitPrice'] = levelItem.stopProfitPrice || _.floor(levelItem.history[0].value * (1 + this.step / 100), 3);
        levelItem['percentLabel'] = currentData.percent;
        levelItem['percent'] = currentData.percent;
        levelItem['type'] = levelItem.type;
        levelItem['target'] = levelItem.target || '';
        levelItem['current'] = currentData.current;
        levelItem['profit'] = currentData.chg * levelItem.count;
        levelItem['profitLabel'] = _.floor(currentData.chg * levelItem.count, 2);
        levelItem['lastCloseValue'] = currentData.last_close * levelItem.count;
        levelItem['total'] = _.floor(currentData.current * levelItem.count);
        levelItem['accountPercentage'] = _.floor(levelItem['total'] / totalLib * 100, 2);
        levelItem['space'] = _.floor( (levelItem['target'] - levelItem['current']) / levelItem['current'] * 100, 2);
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
        let total = _.floor(typeSet[type].total);
        totalList.push({
          type: type,
          total: total,
          profit: _.floor(typeSet[type].profit),
          // levelItem['accountPercentage'] = _.floor(levelItem['total'] / totalValue * 100, 2);
          accountPercentage: _.floor(total / totalLib * 100, 2),
          percentLabel: _.floor(typeSet[type].profit / typeSet[type].total * 100, 2),
        });
      }
      this.totalList = totalList.sort((a, b)=>b.profit - a.profit);
      this.tableData = this.levelList;

      this.profit = _.floor(_.reduce(this.levelList, function(sum, n) {
        return sum + n.profit;
      }, 0));
      let lastCloseValue = _.reduce(this.levelList, function(sum, n) {
        return sum + n.lastCloseValue;
      }, 0);

      let currentData = _.find(data, {symbol: '510310'});
      let levelItem = _.find(this.levelList, {code: '510310'});
      let b = 1.873 / 1.34;
      let pb = currentData.current / b;
      this.markPb = _.floor(pb, 2);
      let floorPrice = _.floor(_.floor(pb, 2) * b, 3);
      let ceilPrice = _.floor(_.ceil(pb, 2) * b, 3);
      let targetRateData = getLibRate(pb, b, floorPrice, currentData.current);
      let targetRate = targetRateData.rate;
      let currentLib = levelItem.count * currentData.current;

      let currentRate = currentLib / totalLib;
      let marginCount = getHundred((targetRate - currentRate) * totalLib / currentData.current);
      let marginValue = _.floor(marginCount * currentData.current);
      this.$set(levelItem, 'pb', _.floor(pb, 3));
      this.$set(levelItem, 'floorPrice', floorPrice);
      this.$set(levelItem, 'ceilPrice', ceilPrice);
      this.$set(levelItem, 'marginCount', marginCount);
      this.$set(levelItem, 'marginValue', marginValue);
      this.$set(levelItem, 'targetRate', _.floor(targetRate * 100, 2));
      this.$set(levelItem, 'currentRate', _.floor(currentRate * 100, 2));

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
      this.historyInfo = getHistoryData();
      if(!this.isHide){
        await this.$nextTick();

        this.initHistoryChart();

      }
    },
    async getBaseData(){
      let result = await axios.get('./base.json')
        .then((res) => {
          return (res.data);
        })
        .catch((e) => {
          console.error(e);
        });
      this.levelList = result.list;
      this.money = result.money;
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

