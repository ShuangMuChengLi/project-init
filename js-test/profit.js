let _ = require('lodash');
let history = [
  {
    value: 1.699,
    count: 17100
  },
  {
    value: 1.7,
    count: 6000
  },
  {
    value: 1.7,
    count: 6000
  },
  {
    value: 1.717,
    count: 6000
  },
  {
    value: 1.727,
    count: 6000
  },
  {
    value: 1.738,
    count: 5700
  },
  {
    value: 1.769,
    count: 5600
  },
  {
    value: 1.781,
    count: 3100
  },
  {
    value: 1.81,
    count: 16500
  },
  {
    value: 1.827,
    count: 16700
  },
];
// let current = 	2;
// let profit = 0;
// let total = 0;
// let count = 0;
// for(let item of history){
//   total += item.value * item.count;
//   count += item.count;
//   profit += (current - item.value) * item.count;
// }
// console.log(_.floor(profit), _.floor(profit / total * 100, 2), total, count);
let current = 1.814;
let target = 1.9;
let count = 307100;
let profit = (target - current) * count;
let total = target * count;
console.log(profit, profit / total * 100, total);
// let libRateMap = [
//   // { pbRate: 0, minLibRate: 0, target: 0 },
//   // { pbRate: 10, minLibRate: 0, target: 0 },
//   // { pbRate: 20, minLibRate: 0, target: 0 },
//   // { pbRate: 30, minLibRate: 0, target: 0 },
//   // { pbRate: 40, minLibRate: 0, target: 0 },
//   { pbRate: 50, minLibRate: 0, target: 2.121 },
//   { pbRate: 60, minLibRate: 10, target: 2.063 },
//   { pbRate: 70, minLibRate: 20, target: 2.005 },
//   { pbRate: 80, minLibRate: 40, target: 1.947 },
//   { pbRate: 90, minLibRate: 70, target: 1.875 },
//   // { pbRate: 100, minLibRate: 100, target: 1.673 }
// ].reverse();
// let current = 1.746;
// let count = 307100;
// let profit = 0;
// let currentRate = 100;
// let money = 0;
// for(let item of libRateMap){
//   let sellCount = count * (currentRate - item.minLibRate) / 100;
//   let currentProfit = (item.target - current) * sellCount;
//   profit += currentProfit;
//   currentRate = item.minLibRate;
//   money += sellCount * item.target;
//   console.log(profit, currentProfit, money, item.pbRate);
// }
