let base = 5000;
function log(value, num){
  console.log(value, (num - 1) * 20 );
}
function fn(total, count){
  log(total, 4 - count + 1);
  total = total * 0.8 + base;
  count--;
  if(count > 0){
    total = fn(total, count);
  }
  return total;
}
let result = fn(base, 4);
log(result, 5);
