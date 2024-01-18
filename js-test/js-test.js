const list = [
  {
    'count': 6100,
    'value': 1.621
  },
  {
    'count': -10000,
    'value': 1.635
  },
  {
    'count': 7100,
    'value': 1.668
  },
  {
    'count': 8200,
    'value': 1.688
  },
  {
    'count': 19600,
    'value': 1.73
  },
];
let value = 0;
let count = 0;
for(let item of list){
  value += item.value * item.count;
  count += item.count;
}
console.log(value, count, (value / count).toFixed(3));