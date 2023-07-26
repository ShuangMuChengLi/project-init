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
    <template v-if="!isHide">
      <div
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
        id="historyChart"
        class="chart"
        @click="futureProfitListVisible = !futureProfitListVisible"
      />
      <el-table
        v-if="futureProfitListVisible"
        :data="futureProfitList"
        class="right-table"
        :cell-style="{height: '20px', padding: '5px 0'}"
        :default-sort="{prop: 'percentLabel', order: 'descending'}"
        height="100vh"
      >
        <el-table-column
          v-for="(item) in futureProfitColumn"
          :key="item.prop"
          :label="getTableLabel(item.label)"
          :prop="item.prop"
          sortable
        >
          <template
            slot-scope="scope"
          >
            <span>{{ getLabel(scope.row, item) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-button
          type="primary"
          @click="detail"
        >
          明细
        </el-button>
      </div>
      <div v-if="partVisible">
        <div>
          <span class="label">基准盈亏：</span>
          <span
            class="number"
            :class="{green: partProfit < 0, red: partProfit > 0}"
          >{{ partProfit }}</span>
        </div>

        <el-table
          :data="partList"
          :cell-style="{height: '20px', padding: '1px 0'}"
          class="left-table"
          height="100vh"
        >
          <el-table-column
            v-for="(item) in partColumn"
            :key="item.prop"
            :label="getTableLabel(item.label)"
            :prop="item.prop"
            sortable
            :width="item.prop === '所属同花顺行业' ? '300px': null"
          >
            <template
              slot-scope="scope"
            >
              <span :class="getRowItemClass(scope.row, item)">{{ getLabel(scope.row, item) }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          :data="partStatisticList"
          class="right-table"
          :cell-style="{height: '20px', padding: '5px 0'}"
          :default-sort="{prop: 'percentLabel', order: 'descending'}"
        >
          <el-table-column
            v-for="(item) in partStatisticColumn"
            :key="item.prop"
            :label="getTableLabel(item.label)"
            :prop="item.prop"
            sortable
          >
            <template
              slot-scope="scope"
            >
              <span>{{ getLabel(scope.row, item) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>
  </div>
</template>

<script>
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import * as echarts from 'echarts';
import { rkMath } from '../../js/tools/rk-math';
import {getHistoryData, getLibRate, getTargetPriceByLib} from './getTargetLib';

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
      lastCloseTotalValue: 0,
      referenceValue: 0,
      markPb: null,
      partList: [],
      partColumn: [

      ],
      partVisible: false,
      partStatisticList: [],
      partStatisticColumn: [],
      futureProfitListVisible: false,
      futureProfitList: [],
      futureProfitColumn: [],
      partProfit: 0
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
        || item.prop === 'stopProfitPrice' && row.stopProfitPrice < row.current
        || row['最新涨跌幅'] > 0 && (['最新涨跌幅', '最新价', '贡献'].includes(item.prop)),

        green:
          row.percent < 0 && (['percentLabel', 'profitLabel', 'current'].includes(item.prop))
          || row['最新涨跌幅'] < 0 && (['最新涨跌幅', '最新价', '贡献'].includes(item.prop))
        ,
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

          // this.init();
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
      this.historyChart = echarts.init(document.getElementById('historyChart'));
      // this.historyChart = echarts.init(document.getElementById('historyChart'));
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
          /**
           * rate,
           marginValue,
           marginCount,
           * @param param
           * @returns {string}
           */
          formatter:  (param)=>{
            return `
            <div>pb：${param[0].data.key}</div>
            <div>rate：${param[0].data.rate}</div>
            <div>marginValue：${param[0].data.marginValue}</div>
            <div>marginCount：${param[0].data.marginCount}</div>
            <div>profit：${param[0].data.profit}</div>
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
          label: '现价',
          prop: 'current',
        });
        this.column.push({
          label: '当前仓位价格',
          prop: 'currentRatePrice',
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
          label: '目标盈利',
          prop: 'marginProfit',
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
          return sum;
        }
        return sum + _.floor(currentData.current * n.count);
      }, 0);
      this.lastCloseTotalValue = _.reduce(this.levelList, (sum, n)=> {
        let currentData = _.find(data, {symbol: n.code});
        if(!currentData){
          return sum;
        }
        return sum + _.floor(currentData.last_close * n.count);
      }, 0);
      let totalLib = this.totalValue + this.money;
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
      let targetRateData = getLibRate(pb, currentData.current);
      let targetRate = targetRateData.rate;
      let currentLib = levelItem.count * currentData.current;
      let currentRate = currentLib / totalLib;
      // let marginCount = getHundred((targetRate - currentRate) * totalLib / currentData.current);
      let marginCount = getHundred((targetRate * totalLib - currentLib) / currentData.current);
      let marginValue = _.floor(marginCount * currentData.current);
      let currentRatePrice = getTargetPriceByLib(currentRate * 100);
      this.$set(levelItem, 'pb', _.floor(pb, 3));
      this.$set(levelItem, 'marginCount', marginCount);
      this.$set(levelItem, 'marginValue', marginValue);
      this.$set(levelItem, 'targetRate', _.floor(targetRate * 100, 2));
      this.$set(levelItem, 'currentRate', _.floor(currentRate * 100, 2));
      this.$set(levelItem, 'currentRatePrice', currentRatePrice);
      this.$set(levelItem, 'marginProfit', _.floor((currentRatePrice - currentData.current) * marginCount));

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
      this.historyInfo = getHistoryData(levelItem.count, this.money, currentData.current);
      /**
       * 模拟未来收益
       */
      let index = _.findIndex(this.historyInfo, {key: this.markPb + ''});
      let list = this.historyInfo.slice(index);
      let count = levelItem.count;
      let money = this.money;
      let current = list[0];
      /**
       * futureProfitList: [],
       futureProfitColumn: [],
       * @type {*[]}
       */
      let profitList = [];
      /**
       * price: item.price,
       marginCount,
       marginValue,
       count,
       money,
       profit: count * item.price + money - totalLib
       * @type {[{prop: string, label: string}, {prop: string, label: string}, {prop: string, label: string}]}
       */
      this.futureProfitColumn = [
        {
          label: 'price',
          prop: 'price'
        },
        {
          label: 'rate',
          prop: 'rate'
        },
        {
          label: 'marginCount',
          prop: 'marginCount'
        },
        {
          label: 'marginValue',
          prop: 'marginValue'
        },
        {
          label: 'count',
          prop: 'count'
        },
        {
          label: 'money',
          prop: 'money'
        },
        {
          label: 'profit',
          prop: 'profit'
        },
      ];
      for(let item of list){
        let lib = item.price * count;
        let total = money + lib;
        // let libRate = item.price * count / total;
        let targetLib = total * (item.rate) / 100;
        let marginCount = getHundred((current.price * count - targetLib) / item.price);
        let marginValue = marginCount * item.price;
        if(
          marginCount >= 15000
          && money < 40 * 10000
          // && item.rate <= 50
        ){
          current = item;
          count -= marginCount;
          money += marginValue;
        }else{
          marginCount = 0;
          marginValue = 0;
        }
        profitList.push({
          price: item.price,
          rate: item.rate,
          marginCount,
          marginValue: _.floor(marginValue),
          count,
          money: _.floor(money),
          profit: _.floor(count * item.price + money - totalLib)
        });
      }

      this.futureProfitList = profitList;
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
    async getAllPartList(){
      this.partList = [];
      let list = [];
      this.partProfit = 0;
      for(let i = 1; i < 4 ; i++){
        let result = await this.getPartList(i);
        list = list.concat(result);
      }
      list.forEach(item=>{
        for(let key in item){
          if(key.includes('市净率') || key.includes('市盈率') || ['沪深300个股权重', '最新价', '最新涨跌幅'].includes(key)){
            item[key] = Number(item[key]);
          }
          if(key.includes('总市值')){
            item[key] = _.floor(item[key] / 10000 / 10000);
          }
        }
        item['持仓'] = _.floor(this.totalValue * item['沪深300个股权重'] / 100);
        let lastCloseValue = _.floor(this.lastCloseTotalValue * item['沪深300个股权重'] / 100);
        if(!item['最新价']){
          item['最新价'] = lastCloseValue;
        }
        if(item['最新涨跌幅']){
          item['贡献'] = _.floor(lastCloseValue * item['最新涨跌幅'] / 100);
        }else{
          item['最新涨跌幅'] = 0;
          item['贡献'] = 0;
        }

      });
      this.partProfit = _.floor(_.reduce(list, function(sum, n) {
        if(!n)return sum;

        return sum + n['贡献'];
      }, 0));
      let partColumn = Object.keys(list[0]).map(item=>{
        return {
          label: item,
          prop: item
        };
      }).filter(item=>{
        return !item.label.match(/(所属指数类|所属概念|a股市值|每股净资产bps|最新dde大单净额|总股本|market_code|code)/);
      });
      this.partColumn = partColumn;
      this.partList = list;
      // partStatisticList: [],
      //   partStatisticColumn: [],
      let group = _.groupBy(this.partList, '所属同花顺行业');
      let partStatisticList = [];
      for(let key in group){
        let item = {
          label: key,
          'rate': 0
        };
        for(let share of group[key]){
          item.rate += share['沪深300个股权重'];
        }
        item.rate = _.floor(item.rate, 3);
        partStatisticList.push(item);
        item.value = _.floor(this.totalValue * item.rate / 100);
      }
      this.partStatisticList = partStatisticList;
      this.partStatisticColumn = [
        {
          label: '所属同花顺行业',
          prop: 'label'
        },
        {
          label: '沪深300个股权重',
          prop: 'rate'
        },
        {
          label: '持仓',
          prop: 'value'
        },
      ];
    },
    async getPartList(page){
      let result = await axios.post(
        '/gateway/urp/v7/landing/getDataList',
        new URLSearchParams({
          'query': '沪深300权重',
          'urp_sort_way': 'desc',
          'urp_sort_index': '沪深300个股权重',
          'page': page,
          'perpage': 100,
          'addheaderindexes': '',
          'condition': JSON.stringify([{
            'chunkedResult': '沪深300指数成分股权重、行业、市净率、市值',
            'opName': 'and',
            'opProperty': '',
            'sonSize': 8,
            'relatedSize': 0
          }, {
            'indexName': '所属指数类',
            'indexProperties': ['包含沪深300'],
            'valueType': '_所属指数类',
            'domain': 'abs_股票领域',
            'uiText': '所属指数类是沪深300指数',
            'sonSize': 0,
            'queryText': '所属指数类是沪深300指数',
            'relatedSize': 0,
            'source': 'new_parser',
            'tag': '所属指数类',
            'type': 'index',
            'indexPropertiesMap': {'包含': '沪深300'}
          }, {'opName': 'and', 'opProperty': '', 'sonSize': 6, 'relatedSize': 0}, {
            'indexName': '沪深300个股权重',
            'indexProperties': [],
            'source': 'new_parser',
            'type': 'index',
            'indexPropertiesMap': {},
            'reportType': 'null',
            'valueType': '_浮点型数值',
            'domain': 'abs_股票领域',
            'uiText': '沪深300个股权重',
            'sonSize': 0,
            'queryText': '沪深300个股权重',
            'relatedSize': 0,
            'tag': '沪深300个股权重'
          }, {'opName': 'and', 'opProperty': '', 'sonSize': 4, 'relatedSize': 0}, {
            'indexName': '所属同花顺行业',
            'indexProperties': [],
            'source': 'new_parser',
            'type': 'index',
            'indexPropertiesMap': {},
            'reportType': 'null',
            'valueType': '_所属同花顺行业',
            'domain': 'abs_股票领域',
            'uiText': '所属同花顺行业',
            'sonSize': 0,
            'queryText': '所属同花顺行业',
            'relatedSize': 0,
            'tag': '所属同花顺行业'
          }, {'opName': 'and', 'opProperty': '', 'sonSize': 2, 'relatedSize': 0}, {
            'indexName': '市净率(pb)',
            'indexProperties': ['nodate 1', '交易日期 20230721'],
            'source': 'new_parser',
            'type': 'index',
            'indexPropertiesMap': {'交易日期': '20230721', 'nodate': '1'},
            'reportType': 'TRADE_DAILY',
            'dateType': '交易日期',
            'valueType': '_浮点型数值(倍)',
            'domain': 'abs_股票领域',
            'uiText': '市净率(pb)',
            'sonSize': 0,
            'queryText': '市净率(pb)',
            'relatedSize': 0,
            'tag': '市净率(pb)'
          }, {
            'indexName': '总市值',
            'indexProperties': ['nodate 1', '交易日期 20230721'],
            'source': 'new_parser',
            'type': 'index',
            'indexPropertiesMap': {'交易日期': '20230721', 'nodate': '1'},
            'reportType': 'TRADE_DAILY',
            'dateType': '交易日期',
            'valueType': '_浮点型数值(元|港元|美元|英镑)',
            'domain': 'abs_股票领域',
            'uiText': '总市值',
            'sonSize': 0,
            'queryText': '总市值',
            'relatedSize': 0,
            'tag': '总市值'
          }]),
          'codelist': '',
          'indexnamelimit': '',
          'logid': '4d12c478020d33506077331e34324b66',
          'ret': 'json_all',
          'sessionid': '4d12c478020d33506077331e34324b66',
          'source': 'Ths_iwencai_Xuangu',
          'date_range[0]': '20230719',
          'iwc_token': '0ac9665416897368747795088',
          'urp_use_sort': '1',
          'user_id': 'Ths_iwencai_Xuangu_k5txqqznnm3r6fa394e2kjdxjardj338',
          'uuids[0]': '24087',
          'query_type': 'stock',
          'comp_id': '6734520',
          'business_cat': 'soniu',
          'uuid': '24087'
        }).toString(),

        // 'query=%E6%B2%AA%E6%B7%B1300%E6%9D%83%E9%87%8D&urp_sort_way=desc&urp_sort_index=%E6%B2%AA%E6%B7%B1300%E4%B8%AA%E8%82%A1%E6%9D%83%E9%87%8D&page=1&perpage=100&addheaderindexes=&condition=%5B%7B%22indexName%22%3A%22%E6%B2%AA%E6%B7%B1300%E4%B8%AA%E8%82%A1%E6%9D%83%E9%87%8D%22%2C%22indexProperties%22%3A%5B%5D%2C%22source%22%3A%22new_parser%22%2C%22type%22%3A%22index%22%2C%22indexPropertiesMap%22%3A%7B%7D%2C%22reportType%22%3A%22null%22%2C%22chunkedResult%22%3A%22%E6%B2%AA%E6%B7%B1300%E6%9D%83%E9%87%8D%22%2C%22valueType%22%3A%22_%E6%B5%AE%E7%82%B9%E5%9E%8B%E6%95%B0%E5%80%BC%22%2C%22domain%22%3A%22abs_%E8%82%A1%E7%A5%A8%E9%A2%86%E5%9F%9F%22%2C%22uiText%22%3A%22%E6%B2%AA%E6%B7%B1300%E4%B8%AA%E8%82%A1%E6%9D%83%E9%87%8D%22%2C%22sonSize%22%3A0%2C%22queryText%22%3A%22%E6%B2%AA%E6%B7%B1300%E4%B8%AA%E8%82%A1%E6%9D%83%E9%87%8D%22%2C%22relatedSize%22%3A0%2C%22tag%22%3A%22%E6%B2%AA%E6%B7%B1300%E4%B8%AA%E8%82%A1%E6%9D%83%E9%87%8D%22%7D%5D&codelist=&indexnamelimit=&logid=4d12c478020d33506077331e34324b66&ret=json_all&sessionid=4d12c478020d33506077331e34324b66&source=Ths_iwencai_Xuangu&date_range%5B0%5D=20230719&iwc_token=0ac9665416897368747795088&urp_use_sort=1&user_id=Ths_iwencai_Xuangu_k5txqqznnm3r6fa394e2kjdxjardj338&uuids%5B0%5D=24087&query_type=stock&comp_id=6734520&business_cat=soniu&uuid=24087',
        {
          headers: {
            // 'Cookie': 'other_uid=Ths_iwencai_Xuangu_k5txqqznnm3r6fa394e2kjdxjardj338; ta_random_userid=rlkgyn255m; cid=0be191494e7e2b927a6078d9578559a11677074607; v=Ay3v7Jn4NTsILtHXiREnqIA_PMKiimGE67_FFG8ya58z3UM8N9pxLHsO1RH8',
            // 'Hexin-V': 'Ay3v7Jn4NTsILtHXiREnqIA_PMKiimGE67_FFG8ya58z3UM8N9pxLHsO1RH8',
            // 'Origin': 'http://www.iwencai.com',
            // 'Host': 'www.iwencai.com',
            // 'Referer': 'http://www.iwencai.com/unifiedwap/result?w=%E6%B2%AA%E6%B7%B1300%E6%9D%83%E9%87%8D&querytype=stock',

          }
        }
      ).then(res => {
        return res.data.answer.components[0].data.datas;
      }).catch(err=>false);
      return result;
      // console.log(result);
      // this.partList.splice((page - 1) * 100, 100, ...result);
    },
    getTableLabel(label){
      return label.replace(/\[\d+\]$/, '');
    },
    detail(){
      this.partVisible = !this.partVisible;
      if(this.partVisible){
        this.getAllPartList();
      }
    }
  }
};
</script>

<style scoped lang="less">
@import "vue-test";
</style>

