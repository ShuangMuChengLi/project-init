<template>
  <div class="al-tree-item">
    <!--内容-->
    <div
      class="al-tree-node-content"
      :dataIndex="dataIndex"
      :style="{paddingLeft:(18*level+'px')}"
    >
      <!--子级菜单，显示 伸缩/展开图标-->
      <span
        v-if="(data[children]&&data[children].length)||isLeaf"
        class="al-tree-expand-icon el-icon-caret-right"
        :dataIndex="dataIndex"
        :class="{alIsLeaf:(!(data[children]&&data[children].length)&&isLeaf),expanded:isExpand}"
      />
      <span
        v-if="showCheckbox"
        class="al-tree-check-icon"
        :dataIndex="dataIndex"
        :class="{isChecked:isChecked===1,indeterminate:isChecked===2}"
      >
        <i
          v-if="isChecked===1"
          class="el-icon-check"
          :dataIndex="dataIndex"
        />
        <i
          v-if="isChecked===2"
          class="el-icon-minus"
          :dataIndex="dataIndex"
        />

      </span>
      <span class="" />
      <!--文本内容-->
      <span class="al-tree-node-label">
        {{ data[label] }}
      </span>
    </div>

    <!--子节点-->
    <div
      v-if="data[children]&&data[children].length&&!renderAfterExpand"
      class="al-tree-node-children"
      role="group"
    >
      <TreeItem
        v-for="(item,index) in data[children]"
        v-show="isExpand"
        :key="index"
        :data-index="dataIndex+'_'+index.toString()"
        :is-leaf="true"
        :data="item"
        :children="children"
        :show-checkbox="showCheckbox"
        :label="label"
        :render-after-expand="renderAfterExpand"
        :level="level+1"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'TreeItem',
  props:{
    data:{
      type:Object,
      default(){
        return null;
      }
    },
    level:{
      type:Number,
      default:0
    },
    dataIndex:{
      default:'0',
      type: String
    },
    isLeaf:{
      type:Boolean,
      default:false
    },
    //是否默认展开所有节点
    defaultExpandAll:{
      type:Boolean,
      default:false
    },
    //是否默认展开所有节点
    renderAfterExpand:{
      type:Boolean,
      default:false
    },
    label:{
      type:String,
      default:'label'
    },
    children:{
      type:String,
      default:'children'
    },
    showCheckbox:{
      type:Boolean,
      default:false,
    },
  },
  data(){
    return{
      isExpand:false, //展开状态
      // isChecked:false,//是否选中
    };
  },
  computed:{
    hasChildNodes(){
      if(this.data?.children?.length){
        return true;
      }else{
        return false;
      }
    },
    isChecked(){
      if(this.data?.isChecked){
        return this.data.isChecked;
      }else{
        return 0;
      }
    },
  },
  watch:{
    defaultExpandAll:{
      immediate:true,
      handler(){
        if(this.defaultExpandAll){
          this.isExpand = true;
        }else{
          this.isExpand = false;
        }
      }
    }
  },
  methods:{
    open(){
      this.isExpand = true;
    },
    close(){
      this.isExpand = false;
    },
    toggle(){
      this.isExpand = !this.isExpand;
    },
  }
};
</script>

<style scoped lang="less">
  .al-tree-item{
    white-space: nowrap;
    outline: 0;
  }
  .al-tree-node-content{
    display: flex;
    align-items: center;
    height: 26px;
    cursor: pointer;
    line-height: 26px;
    &:hover {
      background-color: #F5F7FA;
    }
  }
  .al-tree-node-label{
    font-size: 14px;
  }
  .al-tree-expand-icon{
    cursor: pointer;
    color: #C0C4CC;
    font-size: 12px;
    transform: rotate(0);
    transition: transform .3s ease-in-out;
    padding: 6px;
    margin-right: 8px;
    margin-left: 8px;
    &.alIsLeaf{
      cursor: default!important;
      color: transparent!important;
      pointer-events: none!important;
    }
    &.expanded {
      transform: rotate(90deg);
    }
  }
  .al-tree-check-icon{
    width: 14px;
    height: 14px;
    display: inline-block;
    vertical-align: middle;
    box-sizing: border-box;
    border: 1px solid #DCDFE6;
    border-radius: 2px;
    margin-right: 8px;
    transition: all .3s;
    font-size: 12px;
    line-height: 13px;
    color: #fff;
    &:hover{
      border: 1px solid #409EFF;
    }
    &.isChecked{
      border: 1px solid #3f73ef;
      background: #3f73ef;
    }
    &.indeterminate{
      border: 1px solid #3f73ef;
      background: #3f73ef;
    }
  }
</style>
