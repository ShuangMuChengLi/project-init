// bad
let value;
function mainBad({a, b, c, d, e, f, g}){
  value = a === b ? c : d === e ? f : g;
}
// good
let value2;
function mainGood({a, b, c, d, e, f, g}){
  if(a === b){
    value2 = c;
    return;
  }

  if(d === e){
    value2 = f;
    return;
  }

  value2 = g;
}
// bad
function checkReturnBad(arg) {
  if (arg) {
    return arg;
  } else {
    return 'test';
  }
}
// good
function checkReturnGood(test) {
  return test || 'test';
}
