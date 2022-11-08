<template>
  <div>
    <el-form
      inline
      class="form row"
    >
      <el-form-item label="更新频率： ">
        <el-input
          v-model="second"
          @change="setTimer"
        />
      </el-form-item>
      <el-form-item label="下次刷新：">
        {{ next }}
      </el-form-item>
      <el-form-item class="right">
        <span class="alarm">红色</span>：预警点；<span class="current">蓝色</span>：当前补仓点
      </el-form-item>
    </el-form>
    <el-table
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
              space: getSpace(scope.row, item),
              alarm: scope.row.alarm && (item.prop === 'name'),
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

export default {
  name: 'VueTest',
  data () {
    return {
      tableData: [],
      column: [],
      levelList: [],
      second: 15,
      timer: null,
      next: 0,
      levels: 3,
      step: 20
    };
  },
  async mounted () {
    await this.baseToLevel();

    await this.init();
    this.setTimer();
  },
  methods: {
    setTimer(){
      clearInterval(this.timer);
      this.next = this.second;
      this.timer = setInterval(()=>{
        if(this.next === 0){
          this.init();
          this.next = this.second;
        }else{
          this.next--;
        }
      }, 1000);
    },
    async init () {
      let data = await axios.get('/v5/stock/realtime/quotec.json?symbol=SZ002179,SH601225,SH600438,SZ000858,SH600089,SH600887,SH601318,SZ000333,SH600277,SH510310,SH600036,SH601899,SH600585,SH600018,SH600900,SH600031&_=1667538020157')
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
        let alarmValue = (item.base || _.last(item.history).value) * (100 - item.space - 20) / 100;
        let position = getPosition(item.history[0].value, levelList);
        result.push({
          ...item,
          name: `${item.name}(${item.space})`,
          current: levelList[position],
          currentCount: item.history[0].count,
          list: levelList,
          alarmValue: alarmValue
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
    getSpace(row, item){
      return `-${row.space + 20}%` === item.label;
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
</style>

