<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        v-for="(item) in column"
        :key="item.prop"
        :label="item.label">
        <template slot-scope="scope">
          <span :class="{current: scope.row.current === scope.row.positionList[item - 1] }">{{ scope.row.positionList[item - 1] }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import level from '../../../js-test/level.json';
export default {
  name: 'VueTest',
  data () {
    return {
      tableData: [],
      column: []
    };
  },
  mounted () {
    this.init();
  },
  methods: {
    log(){
      console.log(111);
    },
    init () {
      this.column.push({
        label: '名称',
        prop: 'name'
      });
      for(let i = 0; i < level[0].list.length; i++){
        this.column.push(-90 + 15 * i + '%');
        this.column.push('-');
      }
    },
    getLabel(item, key){
      if(key % 2 === 1){
        return (Math.ceil(item / 2) - 7 ) * 15 + '%';
      }else{
        return '-';
      }
    }
  }
};
</script>

<style scoped lang="less">
.current{
  color: #0000ff;
}
</style>

