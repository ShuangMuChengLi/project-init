function main(){
  if('符合条件1'){
    console.log('操作1');
    if('符合条件2'){
      console.log('操作2');
      if('符合条件3'){
        console.log('操作3');
        if('符合条件4'){
          console.log('操作4');
          if('符合条件5'){
            console.log('操作5');
            console.log('成功');
          }else{
            console.error(new Error('异常'));
          }
        }else{
          console.error(new Error('异常'));
        }
      }else{
        console.error(new Error('异常'));
      }
    }else{
      console.error(new Error('异常'));
    }
  }else{
    console.error(new Error('异常'));
  }
}
