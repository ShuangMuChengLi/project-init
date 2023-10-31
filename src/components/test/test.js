let _ = require('lodash');
let moment = require('moment');
let s = `0	0	0
10	0	0
20	0	5
30	0	10
40	0	20
50	10	50
60	20	70
70	30	80
80	50	90
90	70	100
100	100	100`;
let list = s.split('\n');
let result = [];
for(let item of list){
  let arr = item.split('\t');
  result.push({
    pbRate: Number(arr[0]),
    minLibRate: Number(arr[1]),
    maxLibRate: Number(arr[2]),
  });
}
console.log(result);