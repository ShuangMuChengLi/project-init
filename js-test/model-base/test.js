
let _ = require('lodash');
let moment = require('moment');
let dayDataList = require('./300.json').data.item;
function getRoot(x, y) {
  return Math.pow(x, 1 / y);
}
function getHundred(n){
  return _.ceil(n / 100) * 100;
}
function indexToEtf(index){
  return index * 1.898 / 3963.35;
}
function getNowDate(date){
  return moment(date || null).format('YYYY-MM-DD');
}
const middlePB = 1.49;
const currentPB = 1.37;
let lastItemTargetValue = _.last(dayDataList)[5] * middlePB / currentPB;// 最后一项时间的目标价
let listDiffDays = moment(_.last(dayDataList)[0]).diff( moment(_.first(dayDataList)[0]), 'days'); // 列表天数范围
let perGrowAllDay = getRoot(lastItemTargetValue / _.first(dayDataList)[5], listDiffDays); // 日均上涨幅度
let firstItemMoment = moment(_.first(dayDataList)[0]); // 第一项的日期moment对象
function main(arg){
  let options = {
    log: false,
    basePerCount: 5000, // 每次买入基准数量
    gridStep: 0.02, // 网格
    ...arg
  };
  let gridValue = indexToEtf(dayDataList[0][5]); // 网格价格
  let base = gridValue; // 基准价格，用于获取合理价格
  let libCount = getHundred(196200 * 1.855 / gridValue); // 持仓数量
  let baseLib = libCount * base; // 基准持仓
  let money = 50 * 10000 - baseLib; // 现金
  let currentLib = baseLib; // 当前持仓
  let total = baseLib + money; // 净资产
  let value; // 当前价格
  let profit; // 收益
  let inputList = []; // 投资栈
  function log(...arg){
    if(!options.log){
      return;
    }

    console.log(...arg);
  }

  function isBuyPoint(value, targetValue){
    return gridValue * (1 - options.gridStep) >= value
      && money > 0; // 账户有钱
  }
  function isSellPoint(value, targetValue){
    return gridValue * (1 + options.gridStep) <= value
      && libCount > 0; // 持仓不为空
  }
  let handlerCount = {
    sell:0,
    buy: 0
  };
  for(let i = 0; i < dayDataList.length; i++){
    let item = dayDataList[i];
    value = indexToEtf(item[5]);
    let currentCost = 0;
    let currentCostCount = 0;

    let prevGriValue = gridValue; // 存储网格价格，打印用

    // 获取目前合理价格
    let nowDiffDays = moment(item[0]).diff(firstItemMoment, 'days');
    let targetValue = base * Math.pow(perGrowAllDay, nowDiffDays);
    // 判断买入点
    let buyPoint = isBuyPoint(value, targetValue);
    // 判断卖出点
    let sellPoint = isSellPoint(value, targetValue);

    function calcResult(currentCostCount){
      currentCost = currentCostCount * value; // 当前花销金额
      money -= currentCost; // 当前现金
      libCount += currentCostCount; // 当前持仓数量
      currentLib = libCount * value; // 当前持仓金额
      total = currentLib + money; // 总资产
    }
    if(sellPoint || buyPoint){
      if(sellPoint){
        handlerCount.sell ++;
        currentCostCount = -options.basePerCount;
      }else if(buyPoint){
        handlerCount.buy ++;
        currentCostCount = options.basePerCount;
      }
      gridValue = value; // 记录网格价
    }
    calcResult(currentCostCount);
    if(currentLib > 0){
      inputList.push(currentLib);
    }
    if(!currentCost) continue;

    log(
      '日期：' + getNowDate(item[0]),
      '基准价格：' + _.floor(targetValue, 3),
      '网格价格：' + _.floor(prevGriValue, 3),
      '价格' + _.floor(value, 3),
      '持仓额：' + _.floor(currentLib),
      '花销：' + _.floor(currentCost),
      '持仓数量：' + _.floor(libCount),
      '花销数量：' + _.floor(currentCostCount),
      '现金：' + _.floor(money),
      '资产：' + _.floor(total),
    );
  }
  let inputPerDay = _.reduce(inputList, (sum, n)=> {
    return sum + n;
  }, 0) / listDiffDays;
  profit = total - 500000;
  let years = _.ceil(moment(_.last(dayDataList)[0]).diff( moment(_.first(dayDataList)[0]), 'years'));
  let yearRate = _.floor(getRoot((1 + profit / inputPerDay), years) * 100 - 100, 2 );
  let yearRate300 = _.floor(getRoot(value / base, years) * 100 - 100, 2 );
  log('盈利：' + _.floor(profit), '年化盈利率：' + yearRate + '%', '沪深300盈利率：' + yearRate300 + '%', '持仓天数：' + inputList.length * 7 / 5);
  log(handlerCount);
  log(
    '价格' + _.floor(value, 3),
    '持仓额：' + _.floor(currentLib),
    '持仓数量：' + _.floor(libCount),
    '现金：' + _.floor(money),
    '资产：' + _.floor(total),
  );
  return {profit: _.floor(profit)};
}
main({log: true});

