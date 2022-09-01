<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="名称"
        width="180">
      </el-table-column>
      <el-table-column
        v-for="(item, key) in length"
        :key="item"
        :label="getLabel(item, key)">
        <template slot-scope="scope">
          <span>{{ scope.row.positionList[item - 1] }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import tableData from '../../../js-test/positionList.json';
export default {
  name: 'VueTest',
  data () {
    return {
      tableData: tableData,
      length: tableData[0].positionList.length
    };
  },
  mounted () {
    this.init();
  },
  methods: {
    init () {

    },
    getLabel(item, key){
      if(key % 2 === 1){
        return (Math.ceil(item / 2) - 7) * 10 + '%';
      }else{
        return '-';
      }
    }
  }
};
</script>

<style scoped>

</style>

