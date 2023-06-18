let _ = require('lodash');
let routes = require('./getRoute')();
let getAddStep = require('./getAddStep');
let getCurrentCostCount = require('./getCurrentCostCount');
let baseCount = 196200;
let count = baseCount;
let base = 1.855;
let current = 1.855;
let money = 50 * 10000 - 196200 * 1.855;
let baseLib = count * current;
let input = baseLib; // 投入
let total = baseLib + money;
let leaveMoney = [];
let inputList = [];
let currentStep = 0;
// let target = 2.052;
let target = 3.052;

let statistics = {
  positive: 0,
  negative: 0
};
for(let i in routes){
  let route = routes[i];
  currentStep = currentStep + route;
  let addStep = getAddStep(currentStep);
  let {currentCostCount, value} = getCurrentCostCount(route, addStep, statistics, current, count, target, currentStep);
  current = value;
  count += currentCostCount;
  let cost = -currentCostCount * current;
  money += cost;
  let currentLib = count * current;
  total = money + currentLib;
  leaveMoney.push(_.floor(money));
  input += - cost;
  inputList.push(_.floor(input));
  console.log(
    'i:' + i,
    'route:' + route,
    'currentStep:' + currentStep,
    '价格' + _.floor(current, 3),
    '持仓数量：' + _.floor(count, 2),
    '花销：' + _.floor(-cost, 2),
    '花销数量：' + _.floor(currentCostCount, 2),
    '持仓额：' + _.floor(currentLib, 2),
    '现金：' + _.floor(money, 2),
    '资产：' + _.floor(total, 2),
    '投入：' + _.floor(input, 2),
    '成本：' + _.floor(input < 0 ? 0 : input / count, 2)
  );

  if(current >= target){
    break;
  }

  if(currentLib <= 0 || money <= 0)break;
}
let profit = total - 500000;
let baseTotal = _.reduce(inputList, (sum, n)=> {
  return sum + n;
}, 0) / (statistics.positive + statistics.negative);
let rate = _.floor(profit / baseTotal * 100, 2);
let valueRate = _.floor((current - base) / base * 100, 2);
console.log(profit, current, rate, valueRate);
console.log(statistics);
