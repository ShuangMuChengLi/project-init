let timer;
function click(){
  clearTimeout(timer);
  timer = setTimeout(()=>{
    console.log(123);
  }, 300);
}
click();
click();
