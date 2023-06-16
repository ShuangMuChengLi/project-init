<template>
  <div class="root">
    <p>商品多规格选择示例</p>
    <div
      v-for="(property, propertyIndex) in properties"
      :key="propertyIndex"
    >
      <p>{{ property.name }}</p>
      <div class="sku-box-area">
        <template v-for="(attribute, attributeIndex) in property.attributes">
          <div
            :key="attributeIndex"
            :class="[
              'sku-box',
              'sku-text',
              attribute.isActive ? 'active' : '',
              attribute.isDisabled ? 'disabled' : '',
            ]"
            @click="handleClickAttribute(propertyIndex, attributeIndex)"
          >
            {{ attribute.value }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SkuSelector',
  components: {},
  data() {
    return {
      properties: [], // property 列表
      skuList: [], // sku 列表
      matrix: [], // 邻接矩阵存储无向图
      vertexList: [], // 顶点数组
      selected: [], // 当前已选的 attribute 列表
    };
  },
  computed: {},
  mounted() {
    this.properties = [
      {
        id: '1',
        name: '容量',
        attributes: [
          { value: '1L', isActive: false, isDisabled: false },
          { value: '4L', isActive: false, isDisabled: false },
        ],
      },
      {
        id: '2',
        name: '颜色',
        attributes: [
          { value: '红色', isActive: false, isDisabled: false },
          { value: '黑色', isActive: false, isDisabled: false },
        ],
      },
    ];
    this.skuList = [
      { id: '10', attributes: ['1L', '红色'] },
      { id: '20', attributes: ['1L', '黑色'] },
      { id: '30', attributes: ['4L', '红色'] },
      // { id: "40", attributes: ["4L", "黑色"] },
    ];

    this.initEmptyAdjMatrix();
    this.setAdjMatrixValue();
  },
  methods: {
    // 当点击某个 attribute 时，如：黑色
    handleClickAttribute(propertyIndex, attributeIndex) {
      const attr = this.properties[propertyIndex].attributes[attributeIndex];
      // 若选项置灰，直接返回，表现为点击无响应
      if (attr.isDisabled) {
        return;
      }

      // 重置每个 attribute 的 isActive 状态
      const isActive = !attr.isActive;
      this.properties[propertyIndex].attributes[attributeIndex].isActive =
        isActive;
      if (isActive) {
        this.properties[propertyIndex].attributes.forEach((attr, index) => {
          if (index !== attributeIndex) {
            attr.isActive = false;
          }
        });
      }

      // 维护当前已选的 attribute 列表
      this.selected = [];
      this.properties.forEach((prop) => {
        prop.attributes.forEach((attr) => {
          if (attr.isActive) {
            this.selected.push(attr.value);
          }
        });
      });

      // 重置每个 attribute 的 isDisabled 状态
      this.properties.forEach((prop) => {
        prop.attributes.forEach((attr) => {
          attr.isDisabled = !this.canAttributeSelect(attr);
        });
      });
    },

    // 构造初始空邻接矩阵存储无向图
    initEmptyAdjMatrix() {
      this.properties.forEach((prop) => {
        prop.attributes.forEach((attr) => {
          this.vertexList.push(attr.value);
        });
      });
      for (let i = 0; i < this.vertexList.length; i++) {
        this.matrix[i] = new Array(this.vertexList.length).fill(0);
      }
      console.log(this.vertexList);
    },

    // 根据 skuList 和 properties 设置邻接矩阵的值
    setAdjMatrixValue() {
      this.skuList.forEach((sku) => {
        this.associateAttributes(sku.attributes);
      });
      this.properties.forEach((prop) => {
        this.associateAttributes(prop.attributes);
      });
    },

    // 将 attributes 属性组中的属性在无向图中联系起来
    associateAttributes(attributes) {
      attributes.forEach((attr1) => {
        attributes.forEach((attr2) => {
          // 因 properties 与 skuList 数据结构不一致，需作处理
          if (attr1 !== attr2 || attr1.value !== attr2.value) {
            if (attr1.value && attr2.value) {
              attr1 = attr1.value;
              attr2 = attr2.value;
            }
            const index1 = this.vertexList.indexOf(attr1);
            const index2 = this.vertexList.indexOf(attr2);
            if (index1 > -1 && index2 > -1) {
              this.matrix[index1][index2] = 1;
            }
          }
        });
      });
    },

    // 判断当前 attribute 是否可选，返回 true 表示可选，返回 false 表示不可选，选项置灰
    canAttributeSelect(attribute) {
      if (!this.selected || !this.selected.length || attribute.isActive) {
        return true;
      }
      let res = [];
      this.selected.forEach((value) => {
        const index1 = this.vertexList.indexOf(value);
        const index2 = this.vertexList.indexOf(attribute.value);
        res.push(this.matrix[index1][index2]);
      });
      return res.every((item) => item === 1);
    },
  },
};
</script>

<style>
.root {
  width: 350px;
  padding: 24px;
}
.sku-box-area {
  display: flex;
  flex: 1;
  flex-direction: row;
  flex-wrap: wrap;
}
.sku-box {
  border: 1px solid #cccccc;
  border-radius: 6px;
  margin-right: 12px;
  padding: 8px 10px;
  margin-bottom: 10px;
}
.sku-text {
  font-size: 16px;
  line-height: 16px;
  color: #666666;
}
.active {
  border-color: #ff6600;
  color: #ff6600;
}
.disabled {
  opacity: 0.5;
  border-color: #e0e0e0;
  color: #999999;
}
</style>

