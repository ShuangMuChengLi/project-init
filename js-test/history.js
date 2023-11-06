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
//   {
//     value: 1.769,
//     count: 5600
//   },
//   {
//     value: 1.781,
//     count: 3100
//   },
//   {
//     value: 1.81,
//     count: 16500
//   },
//   {
//     value: 1.827,
//     count: 16700
//   },
];
let current = 1.75;
let profit = 0;
let total = 0;
for(let item of history){
  total += item.value * item.count;
  profit += (current - item.value) * item.count;
}
console.log(profit);
console.log(total);
console.log(profit / total * 100);