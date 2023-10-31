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
        <span>{{ next }}</span>
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
              <a
                v-if="item.label === '名称' && scope.row.code"
                :class="getRowItemClass(scope.row, item)"
                :href="getLinkMain(scope.row)"
                target="_blank"
              >{{ getLabel(scope.row, item) }}</a>
              <span
                v-else
                :class="getRowItemClass(scope.row, item)"
              >{{ getLabel(scope.row, item) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div
        id="historyChart"
        class="chart"
        @click="futureProfitListVisible = !futureProfitListVisible"
      />
      <p class="statistic-row">
        近十年更低估天数{{ positionIndex }}，总数{{ historyCount }}
      </p>
      <div>
        <el-button
          type="primary"
          @click="detail"
        >
          明细
        </el-button>
      </div>
      <div v-if="partVisible">
        <div class="input-wrapper">
          <div>
            <span class="label">基准盈亏：</span>
            <span
              class="number"
              :class="{green: partProfit < 0, red: partProfit > 0}"
            >{{ partProfit }}</span>
          </div>
          <div>
            <el-input
              v-model="keyword"
              clearable
              placeholder="筛选"
              suffix-icon="el-icon-search"
              style="width: 250px;"
              @change="filter"
            />
            <el-button
              class="button"
              type="primary"
              @click="getAllPartList"
            >
              刷新
            </el-button>
          </div>
        </div>
        <el-table
          :data="partList"
          :cell-style="{height: '20px', padding: '1px 0'}"
          class="left-table"
          height="100vh"
        >
          <el-table-column
            label="序号"
            type="index"
            width="50"
          />
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
              <a
                v-if="item.label === '股票简称' && scope.row.code"
                :class="getRowItemClass(scope.row, item)"
                :href="getLink(scope.row)"
                target="_blank"
              >{{ getLabel(scope.row, item) }}</a>
              <a
                v-else-if="item.label === 'info' && scope.row.info"
                :href="scope.row.info"
                target="_blank"
              >笔记</a>
              <span
                v-else
                :class="getRowItemClass(scope.row, item)"
              >{{ getLabel(scope.row, item) }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          :data="partStatisticList"
          class="right-table"
          :cell-style="{height: '20px', padding: '5px 0'}"
          :default-sort="{prop: 'percentLabel', order: 'descending'}"
          :tree-props="{children: 'children'}"
          row-key="id"
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
              <a
                v-if="item.label === '所属同花顺行业' && scope.row.code"
                :class="getRowItemClass(scope.row, item)"
                :href="getLink(scope.row)"
                target="_blank"
              >{{ getLabel(scope.row, item) }}</a>
              <a
                v-else-if="item.label === '笔记' && scope.row.info"
                :href="scope.row.info"
                target="_blank"
              >笔记</a>
              <span
                v-else
                :class="getRowItemClass(scope.row, item)"
              >{{ getLabel(scope.row, item) }}</span>
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
import {getHistoryData, getLibRate, initPb} from './getTargetLib';
export default {
  name: 'VueTest',
  data () {
    return {
      keyword: null, // 关键字
      money: 0,
      isHide: true,
      tableData: [],
      column: [
        {
          'label': '名称',
          'prop': 'name'
        },
        {
          'label': '涨跌幅',
          'prop': 'percentLabel'
        },
        {
          'label': '当日盈利',
          'prop': 'profitLabel'
        },
        {
          'label': '现价',
          'prop': 'current'
        },
        {
          'label': 'pb',
          'prop': 'pb'
        },
        {
          'label': '百分位',
          'prop': 'pbRate'
        },
        {
          'label': '最低仓位',
          'prop': 'minLibRate'
        },
        {
          'label': '最高仓位',
          'prop': 'maxLibRate'
        },
        {
          'label': '当前仓位',
          'prop': 'currentRate'
        },
        {
          'label': '交易数量',
          'prop': 'dealCount'
        },
        {
          'label': '交易金额',
          'prop': 'dealMoney'
        },
        {
          'label': '持仓数量',
          'prop': 'count'
        },
        {
          'label': '持仓',
          'prop': 'total'
        }
      ],
      levelList: [],
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
      allPartList: [],
      HS300: [],
      partColumn: [

      ],
      partVisible: false,
      partStatisticList: [],
      partStatisticColumn: [],
      partProfit: 0,
      positionIndex: 0,
      historyCount: 0,
      B: null
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
    await initPb();
    this.now = moment();
    await this.getBaseData();
    await this.getPartBaseData();
    await this.init();
    this.setTimer();
  },
  methods: {
    
    async init () {
      let data = await this.getRealtimeData();

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
      for(let levelItem of this.levelList){
        let currentData = _.find(data, {symbol: levelItem.code});
        if(!currentData)continue;

        levelItem['pbRate'] = '-';
        levelItem['currentRate'] = '-';
        levelItem['percentLabel'] = currentData.percent;
        levelItem['percent'] = currentData.percent;
        levelItem['current'] = currentData.current;
        levelItem['profit'] = currentData.chg * levelItem.count;
        levelItem['profitLabel'] = _.floor(currentData.chg * levelItem.count, 2);
        levelItem['lastCloseValue'] = currentData.last_close * levelItem.count;
        levelItem['total'] = _.floor(currentData.current * levelItem.count);
      }
      this.tableData = this.levelList;

      this.profit = _.floor(_.reduce(this.levelList, function(sum, n) {
        return sum + n.profit;
      }, 0));
      let lastCloseValue = _.reduce(this.levelList, function(sum, n) {
        return sum + n.lastCloseValue;
      }, 0);

      this.set300ItemData(data);

      this.percentage = _.ceil(this.profit / lastCloseValue * 100, 2) + '%';
      document.title = this.profit;
      this.historyInfo = getHistoryData(this.B);
      if(!this.isHide){
        await this.$nextTick();

        this.initHistoryChart();

      }
    },
    /**
     * 获取实时行情
     */
    async getRealtimeData(){
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
      return data;
    },
    getHundred(n){
      return _.floor(n / 100) * 100;
    },
    /**
     * 单独配置hs300数据项
     * @param {*} data 
     */
    set300ItemData(data){
      let totalLib = this.totalValue + this.money;
      let currentData = _.find(data, {symbol: '510310'});
      let levelItem = _.find(this.levelList, {code: '510310'});
      let b = this.B;
      let pb = currentData.current / b;
      this.markPb = _.floor(pb, 2);
      let {rate: pbRate, positionIndex, total: historyCount, minLibRate, maxLibRate} = getLibRate(pb, currentData.current, this.B);
      this.positionIndex = positionIndex;
      this.historyCount = historyCount;
      let currentLib = _.floor(levelItem.count * currentData.current);
      let currentRate = currentLib / totalLib;
      this.$set(levelItem, 'minLibRate', minLibRate);
      this.$set(levelItem, 'maxLibRate', maxLibRate);
      this.$set(levelItem, 'pb', _.floor(pb, 3));
      this.$set(levelItem, 'pbRate', _.floor(pbRate * 100, 2));
      this.$set(levelItem, 'currentRate', _.floor(currentRate * 100, 2));
      let dealCount = '-';
      let dealMoney = '-';
      if(levelItem.currentRate > maxLibRate){
        dealMoney = totalLib * (maxLibRate - levelItem.currentRate) / 100;
        dealCount = this.getHundred(dealMoney / currentData.current);
        dealMoney = currentData.current * dealCount;
      }
      if(levelItem.currentRate < minLibRate){
        dealMoney = totalLib * (minLibRate - levelItem.currentRate) / 100;
        dealCount = this.getHundred(dealMoney / currentData.current);
        dealMoney = currentData.current * dealCount;
      }
      this.$set(levelItem, 'dealCount', dealCount);
      this.$set(levelItem, 'dealMoney', dealMoney);
    },
    getRowItemClass(row, item){
      return {
        red: row.percent > 0 && (['percentLabel', 'profitLabel', 'current'].includes(item.prop))
        || row['最新涨跌幅'] > 0 && (['最新涨跌幅', '最新价', '贡献'].includes(item.prop)),
        green:
          row.percent < 0 && (['percentLabel', 'profitLabel', 'current'].includes(item.prop))
          || row['最新涨跌幅'] < 0 && (['最新涨跌幅', '最新价', '贡献'].includes(item.prop))
          || ['percentLabel', 'profit'].includes(item.prop) && row['profit'] < 0
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

          this.init();
        }else{
          this.next--;
        }
      }, 1000);
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
           * @param param
           * @returns {string}
           */
          formatter:  (param)=>{
            return `
            <div>pb：${param[0].data.key}</div>
            <div>rate：${param[0].data.rate}</div>
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
      this.B = result.B;
    },
    async getPartBaseData(){
      let result = await axios.get('./HS300.json')
        .then((res) => {
          return (res.data);
        })
        .catch((e) => {
          console.error(e);
        });
      this.HS300 = result;
    },
    getLabel(row, item){
      if(!row[item.prop] && row[item.prop] !== 0){
        return '';
      }

      return row[item.prop];
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
        let type = item['所属同花顺行业'].split('-');
        item['firstType'] = type[0];
        item['secondType'] = type[1];
        item['thirdType'] = type[2];
        item['info'] = _.find(this.HS300, {code: item['股票代码']})?.info || '';
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
        return !item.label.match(/(所属指数类|所属概念|a股市值|每股净资产bps|最新dde大单净额|总股本|market_code|code|预测|利率|收益)/);
      });
      this.partColumn = partColumn;
      this.allPartList = list;
      this.filter();
      let groupByType = (typeKey, list)=>{
        let partStatisticList = [];
        let group = _.groupBy(list, typeKey);
        for(let key in group){
          let item = {
            id: typeKey + key,
            label: key,
            value: 0,
            percentLabel: 0,
            'rate': 0,
            profit: 0
          };
          for(let share of group[key]){
            item.rate += share['沪深300个股权重'];
            item.profit += share['贡献'];
          }
          item.rate = _.floor(item.rate, 3);
          item.profit = _.floor(item.profit);
          item.value = _.floor(this.totalValue * item.rate / 100);
          item.percentLabel = _.floor(item.profit / item.value * 100, 2);
          let typeMap = {
            'firstType': 'secondType',
            'secondType': 'thirdType'
          };
          if(typeMap[typeKey]){
            item.children = groupByType(typeMap[typeKey], group[key]);
          }else{
            item.children = group[key].map(item=>{
              return {
                ...item,
                id: item['code'],
                label: item['股票简称'],
                value: item['持仓'],
                percentLabel:  item['最新涨跌幅'],
                'rate': item['沪深300个股权重'],
                profit:  item['贡献'],
              };
            });
          }
          partStatisticList.push(item);
        }
        return partStatisticList;
      };
      let partStatisticList = groupByType('firstType', this.partList);
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
        {
          label: '涨跌幅',
          prop: 'percentLabel'
        },
        {
          label: '盈利',
          prop: 'profit'
        },
        {
          label: '笔记',
          prop: 'info'
        },
      ];
    },
    filter(){
      if(!this.keyword){
        this.partList = this.allPartList;
        return;
      }

      this.partList = this.allPartList.filter(item=>{
        return item['股票简称'].includes(this.keyword);
      });
    },
    async getPartList(page){
      let result = await axios.post(
        '/gateway/urp/v7/landing/getDataList',
        new URLSearchParams({
          'query': '沪深300权重市净率市盈率所属同花顺行业',
          'urp_sort_way': 'desc',
          'urp_sort_index': '沪深300个股权重',
          'page': page,
          'perpage': 100,
          'addheaderindexes': '',
          'condition': JSON.stringify([{'chunkedResult':'沪深300权重同花顺分类市净率_&_市盈率_&_所属同花顺行业', 'opName':'and', 'opProperty':'', 'sonSize':6, 'relatedSize':0}, {'indexName':'沪深300个股权重', 'indexProperties':[], 'source':'new_parser', 'type':'index', 'indexPropertiesMap':{}, 'reportType':'null', 'valueType':'_浮点型数值', 'domain':'abs_股票领域', 'uiText':'沪深300个股权重', 'sonSize':0, 'queryText':'沪深300个股权重', 'relatedSize':0, 'tag':'沪深300个股权重'}, {'opName':'and', 'opProperty':'', 'sonSize':4, 'relatedSize':0}, {'indexName':'市净率(pb)', 'indexProperties':['nodate 1', '交易日期 20230817'], 'source':'new_parser', 'type':'index', 'indexPropertiesMap':{'交易日期':'20230817', 'nodate':'1'}, 'reportType':'TRADE_DAILY', 'dateType':'交易日期', 'valueType':'_浮点型数值(倍)', 'domain':'abs_股票领域', 'uiText':'市净率(pb)', 'sonSize':0, 'queryText':'市净率(pb)', 'relatedSize':0, 'tag':'市净率(pb)'}, {'opName':'and', 'opProperty':'', 'sonSize':2, 'relatedSize':0}, {'indexName':'市盈率(pe)', 'indexProperties':['nodate 1', '交易日期 20230817'], 'source':'new_parser', 'type':'index', 'indexPropertiesMap':{'交易日期':'20230817', 'nodate':'1'}, 'reportType':'TRADE_DAILY', 'dateType':'交易日期', 'valueType':'_浮点型数值(倍)', 'domain':'abs_股票领域', 'uiText':'市盈率(pe)', 'sonSize':0, 'queryText':'市盈率(pe)', 'relatedSize':0, 'tag':'市盈率(pe)'}, {'indexName':'所属同花顺行业', 'indexProperties':[], 'source':'new_parser', 'type':'index', 'indexPropertiesMap':{}, 'reportType':'null', 'valueType':'_所属同花顺行业', 'domain':'abs_股票领域', 'uiText':'所属同花顺行业', 'sonSize':0, 'queryText':'所属同花顺行业', 'relatedSize':0, 'tag':'所属同花顺行业'}]),
          'codelist': '',
          'indexnamelimit': '',
          'logid': '6a9da8bb544050844a643ed3e9084342',
          'ret': 'json_all',
          'sessionid': '6a9da8bb544050844a643ed3e9084342',
          'source': 'Ths_iwencai_Xuangu',
          'date_range[0]': '20230817',
          'iwc_token': '0ac9665416897368747795088',
          'urp_use_sort': '1',
          'user_id': 'Ths_iwencai_Xuangu_k5txqqznnm3r6fa394e2kjdxjardj338',
          'uuids[0]': '24087',
          'query_type': 'stock',
          'comp_id': '6836372',
          'business_cat': 'soniu',
          'uuid': '24087'
        }).toString(),
        {
          headers: {
          }
        }
      ).then(res => {
        return res.data.answer.components[0].data.datas;
      }).catch(err=>false);
      return result;
    },
    getTableLabel(label){
      return label.replace(/\[\d+\]$/, '');
    },
    detail(){
      this.partVisible = !this.partVisible;
      if(this.partVisible){
        this.getAllPartList();
      }
    },
    getLink(item){
      if(!item['股票代码'])return;

      let part = item['股票代码'].split('.');
      return `https://xueqiu.com/S/${part[1]}${part[0]}`;
    },
    getLinkMain(item){
      if(!item['prevCode'])return;

      return `https://xueqiu.com/S/${item.prevCode}${item.code}`;
    },
  }
};
</script>

<style scoped lang="less">
@import "vue-test.less";
</style>

