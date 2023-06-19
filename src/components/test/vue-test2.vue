<template>
  <div class="root">
    <al-tree
      ref="tree"
      :data="list"
      :default-expand-all="false"
      show-checkbox
      node-key="id"
      highlight-current
      style="padding-top: 5px;"
      :props="defaultProps"
      @checkChange="getCheckedNodes"
    />
  </div>
</template>

<script>
import AlTree from './Tree';
export default {
  name: 'SkuSelector',
  components: {AlTree},
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      list: [
        {
          label: '111',
          id: '111',
          children: [
            {
              label: '222',
              id: '222',

            }
          ]
        }
      ]
    };
  },
  computed: {},
  mounted() {

  },
  methods: {
    getCheckedNodes(){

    }
  },
};
</script>

<style>

</style>

