<template>
  <div
    class="al-tree"
    @click="click"
  >
    <AlTreeItem
      v-for="(item,index) in computedData"
      :key="index"
      :data="item"
      :data-index="'0_'+index"
      :children="props.children?props.children:'children'"
      :show-checkbox="showCheckbox"
      :label="props.label?props.label:'label'"
      :render-after-expand="renderAfterExpand"
      :default-expand-all="defaultExpandAll"
      :level="0"
    />
  </div>
</template>

<script>
import AlTreeItem from './TreeItem';
import Vue from 'vue';
export default {
  name: 'AlTree',
  components:{AlTreeItem},
  props:{
    data:{
      type:Array,
      default(){
        return [];
      }
    },
    //是否默认展开所有节点
    defaultExpandAll:{
      type:Boolean,
      default:false
    },
    //是否在第一次展开某个树节点后才渲染其子节点
    renderAfterExpand:{
      type:Boolean,
      default:false
    },
    //是否在点击节点的时候展开或者收缩节点， 默认值为 true，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点
    expandOnClickNode:{
      type:Boolean,
      default: false
    },
    props:{
      type:Object,
      default(){
        return {
          children: 'children',
          label: 'label'
        };
      }
    },
    showCheckbox:{
      type:Boolean,
      default:false,
    },
    nodeKey:{
      type:String,
      default:'id',
    }
  },
  data() {
    return {
      computedData: null
    };
  },
  computed:{
    checkedKeys(){
      return 1;
    },
    checkedKeysWithoutChildren(){
      return 1;
    }
  },
  watch:{
    data:{
      immediate:true,
      deep:true,
      handler(){
        this.computedData = JSON.parse(JSON.stringify(this.data));
      }
    }
  },
  methods: {
    click(e) {
      let item = e.target;
      //选中功能
      if(this.showCheckbox && (item?.classList?.contains('al-tree-check-icon') || item?.classList?.contains('el-icon-check'))){
        this.clickAt(item.getAttribute('dataIndex'), 'al-tree-check-icon');
        return;
      }

      //展开功能
      //只有点箭头图标的时候才会展开或者收缩节点
      if((item?.classList?.contains('al-tree-expand-icon'))){
        this.clickAt(item.getAttribute('dataIndex'), 'al-tree-expand-icon');
        return;
      }

      //在点击节点的时候展开或者收缩节点
      if(!this.expandOnClickNode && (item?.classList?.contains('al-tree-node-content'))){
        this.clickAt(item.getAttribute('dataIndex'), 'al-tree-node-content');
        return;
      }
    },
    //找出点击的元素
    clickAt(dataIndex, domClass){
      var indexList = dataIndex.split('_');
      var targetComponent = {$children:[this]};
      for(var i = 0;i < indexList.length;i++){
        targetComponent = targetComponent.$children[indexList[i]];
      }

      //展开
      if(domClass === 'al-tree-node-content' || domClass === 'al-tree-expand-icon'){
        if((targetComponent?.toggle) && targetComponent.hasChildNodes){
          targetComponent.toggle();
        }
      }
      //选中
      if(domClass === 'al-tree-check-icon'){
        var level = indexList.length;
        var str = 'this.computedData';

        //计算出当前选中的对象
        for(var i = 1;i < indexList.length;i++){
          if(i > 1){
            str += ('.' + this.props.children);
          }
          str += ('[' + indexList[i] + ']');
        }
        var obj = eval(str);

        //如果已经全选中，则点击后变为未选中(点击后，状态要么0要么1)
        if(obj.isChecked && obj.isChecked === 1){
          // Vue.set( obj, 'isChecked', 0 )
          obj.isChecked = 0;
        }else{
          // Vue.set( obj, 'isChecked', 1 )
          obj.isChecked = 1;
        }
        //如果当前对象存在子代，则迭代循环将所有子代的isChecked改成跟当前对象同样值
        if(obj[this.props.children]){
          this.setChildChecked(obj[this.props.children], obj.isChecked);
        }
        //迭代循环，检查当前对象的父级是否需要改变
        this.computedData = this.setParentChecked(this.computedData).val;
        this.computedData = JSON.parse(JSON.stringify(this.computedData));
        this.checkChange();
      }
    },
    setParentChecked(list){
      var checkedCount = 0;
      var childSetCheckedVal = {};
      var hasIndeterminate = false;
      var len = list.length;
      for(var i = 0;i < len;i++){
        if(list[i][this.props.children]?.length){
          //有子代,需要检查下子代的选中情况
          childSetCheckedVal = this.setParentChecked(list[i][this.props.children]);

          //如果父级从来没有赋值过，加上0
          if(!list[i].isChecked && list[i].isChecked !== 0){
            list[i].isChecked = 0;
          }
          if(list[i].isChecked !== childSetCheckedVal.isChecked){
            list[i].isChecked = childSetCheckedVal.isChecked;
            list[i][this.props.children] = childSetCheckedVal.val;
            // Vue.set( list[i], 'isChecked', childSetCheckedVal.isChecked )
            //
            // Vue.set( list[i], this.props.children, childSetCheckedVal.val )
          }
          if(list[i].isChecked === 1){
            checkedCount++;
          }
          if(list[i].isChecked === 2){
            hasIndeterminate = true;
          }
        }else{
          if(list[i].isChecked === 1){
            checkedCount++;
          }
        }
      }

      var result = {
        val:list
      };
      if(len === checkedCount){
        result.isChecked = 1;
      }else if(checkedCount > 0 && checkedCount < len){
        result.isChecked = 2;
      }else{
        result.isChecked = 0;
      }
      //如果isChecked为未选中，但是有半选中状态，则直接将结果改成半选中
      if(result.isChecked === 0 && hasIndeterminate){
        result.isChecked = 2;
      }

      return result;
    },
    setChildChecked(list, state){
      var len = list.length;
      for(var i = 0;i < len;i++){
        list[i].isChecked = state;
        if(list[i][this.props.children]?.length){
          this.setChildChecked(list[i][this.props.children], state);
        }
      }
    },
    collectKeys(list, withoutParent = false){
      var len = list.length;
      var keys = [];
      for(var i = 0;i < len;i++){
        var hasChildren = list[i][this.props.children] && list[i][this.props.children].length;
        //如果有子代
        if(hasChildren){
          //如果需要带父级的key
          if(!withoutParent && list[i].isChecked === 1){
            keys.push(list[i][this.nodeKey]);
          }
          keys = keys.concat(this.collectKeys(list[i][this.props.children], withoutParent));
        }else if(list[i].isChecked === 1){
          keys.push(list[i][this.nodeKey]);
        }
      }
      return keys;
    },
    //还需要实现的功能
    getCheckedKeys(withoutParent){
      return this.collectKeys(this.computedData, withoutParent);
    },
    setCheckedKeys(list, setCheckedList){
      //检查是否有传检查用的数组
      var firstTime = false;
      //如果没传，则是第一遍迭代，设定被设置的数组为完整list
      if(!(setCheckedList && setCheckedList.length)){
        setCheckedList = this.computedData;
        firstTime = true;
      }
      var len = setCheckedList.length;
      for(var i = 0;i < len;i++){
        var hasChildren = setCheckedList[i][this.props.children] && setCheckedList[i][this.props.children].length;

        if(setCheckedList[i][this.nodeKey]){
          if(list.indexOf(setCheckedList[i][this.nodeKey]) !== -1){
            setCheckedList[i].isChecked = 1;
          }else{
            setCheckedList[i].isChecked = 0;
          }
        }
        if(hasChildren){
          this.setCheckedKeys(list, setCheckedList[i][this.props.children]);
        }
      }
      if(firstTime){
        //迭代循环，检查当前对象的父级是否需要改变
        this.computedData = this.setParentChecked(this.computedData).val;
        this.computedData = JSON.parse(JSON.stringify(this.computedData));
        this.checkChange();
      }
    },
    checkChange(){
      this.$emit('checkChange');
    },
  }
};
</script>

<style scoped lang="less">
  .al-tree{
    position: relative;
    cursor: default;
    background: #FFF;
    color: #606266;
    text-align: left;
  }
</style>
