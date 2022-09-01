function main(){
  if('不符合条件1') {
    console.error(new Error('异常'));
    return;
  }

  console.log('操作1');
  if('不符合条件2') {
    console.error(new Error('异常'));
    return;
  }

  console.log('操作2');
  if('不符合条件3') {
    console.error(new Error('异常'));
    return;
  }

  console.log('操作3');
  if('不符合条件4') {
    console.error(new Error('异常'));
    return;
  }

  console.log('操作4');
  if('不符合条件5') {
    console.error(new Error('异常'));
    return;
  }

  console.log('操作5');
  console.log('成功');
}
