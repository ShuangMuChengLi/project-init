let obj = {
  thenFn(res){
    if(!res.data.successFlg)return false;

    this.$message.success(res.data.message);
    return true;
  },
  //标签类型添加保存按钮
  saveTagType(e){
    this.$refs.tagTypeForm.validate(async value => {
      if(!value) return;

      let typeToApi = {
        '标签类型添加': 'addTagType',
        '标签类型编辑': 'updateTagType'
      };
      let apiName = typeToApi[this.dialogType];
      let result = await tagApi[apiName](this.tagTypeForm)
        .then(this.thenFn)
        .catch(err=>false);
      if(!result)return;

      this.getTagTypeTableData(this.tagTypePage, this.tagTypeRows);
      this.dialogType = '';
    });
  },
  //标签类型添加保存按钮
  saveTagTypeOld(e){
    this.$refs.tagTypeForm.validate(value => {
      if(value) {
        if(this.dialogType === '标签类型添加'){
          tagApi.addTagType(this.tagTypeForm).then((res)=>{
            if(res.data.successFlg){
              this.$message.success(res.data.message);
              this.getTagTypeTableData(this.tagTypePage,this.tagTypeRows);
              this.dialogType = '';
            }
          });
        }else if(this.dialogType === '标签类型编辑'){
          tagApi.updateTagType(this.tagTypeForm).then((res)=>{
            if(res.data.successFlg){
              this.$message.success(res.data.message);
              this.getTagTypeTableData(this.tagTypePage,this.tagTypeRows);
              this.dialogType = '';
            }
          });
        }
      }
    });

  },
}

