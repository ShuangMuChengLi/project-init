let _ = require('lodash');
let moment = require('moment');
let dayDataList = require('./300.json').data.item;
function getRoot(x, y) {
  return Math.pow(x, 1 / y);
}
function getHundred(n){
  return _.ceil(n / 100) * 100;
}
function ETFToIndex(index){
  return index * 1.898 / 3963.35;
}
function getNowDate(date){
  return moment(date || null).format('YYYY-MM-DD');
}
let lastItemTargetValue = _.last(dayDataList)[5] * 1.49 / 1.37;
let listDiffDays = moment(_.last(dayDataList)[0]).diff( moment(_.first(dayDataList)[0]), 'days');
let perGrowAllDay = getRoot(lastItemTargetValue / _.first(dayDataList)[5], listDiffDays); // workday 1.0002070051602752
let firstItemMoment = moment(_.first(dayDataList)[0]);
function main(arg){
  let options = {
    log: false,
    clearUpTargetRate: 1.6, // 高估比例高估清仓阈值
    rebuildRate: 1.1, // 建仓阈值
    rebuildPart: 5, // 建仓仓位
    gridStep: 0.02, // 网格量
    buyRate: 1.02, // 买入比
    isNoGrid: false,
    basePerCount: 10000, // 每次买入数量
    ...arg
  };
  let gridValue = ETFToIndex(dayDataList[0][5]);
  let base = gridValue;
  let libCount = getHundred(196200 * 1.855 / gridValue);
  let baseLib = libCount * base;
  let money = 50 * 10000 - baseLib;
  let currentLib = baseLib;
  let total = baseLib + money;
  let value;
  let profit;
  let inputList = [];
  let valueRate;
  let isClear = false;
  function log(...arg){
    if(!options.log){
      return;
    }

    console.log(...arg);
  }
  function getStatus(targetValue){
    if(targetValue >= value){
      return 'low';
    }else{
      return 'up';
    }
  }
  function isBuyPoint(value, targetValue){
    return (!options.isNoGrid && !isClear && gridValue * (1 - options.gridStep) >= value || isClear && value <= targetValue * options.rebuildRate)
      && value < targetValue * options.clearUpTargetRate // 价格没有过于高估
      && money >= options.basePerCount * options.buyRate * value ; // 账户有钱
  }
  function isSellPoint(value, targetValue){
    return (!options.isNoGrid && gridValue * (1 + options.gridStep) <= value || targetValue * options.clearUpTargetRate <= value) // 高于上次网格价1.02
      && libCount > 0; // 持仓不为空
  }
  let handlerCount = {
    sell:0,
    buy: 0
  };
  for(let i = 0; i < dayDataList.length; i++){
    let item = dayDataList[i];
    value = ETFToIndex(item[5]);
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
    let nowStatus = getStatus(targetValue);

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
        if(targetValue * options.clearUpTargetRate <= value || options.basePerCount > libCount){
          console.log(targetValue * options.clearUpTargetRate <= value ? '高估清仓' : '为零清仓');
          currentCostCount = -libCount;
          isClear = true;
        }else{
          currentCostCount = -options.basePerCount;
        }
      }else if(buyPoint){
        handlerCount.buy ++;
        if(isClear && value <= targetValue * options.rebuildRate){
          console.log('建仓');
          currentCostCount = getHundred(money * (options.rebuildPart / 10) / value);
          isClear = false;
        }else if(!isClear){
          currentCostCount = options.basePerCount * options.buyRate;
        }
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
  }, 0) / inputList.length;
  profit = total - 500000;
  let preYearRate = _.floor(getRoot((1 + profit / inputPerDay), _.floor(inputList.length * 7 / 5 / 242)) * 100 - 100, 2 );
  let preYearRate300 = _.floor(getRoot(value / base, _.floor(moment(_.last(dayDataList)[0]).diff( moment(_.first(dayDataList)[0]), 'years'))) * 100 - 100, 2 );
  log('盈利：' + _.floor(profit), '年化盈利率：' + preYearRate + '%', '沪深300盈利率：' + preYearRate300 + '%', '持仓天数：' + inputList.length * 7 / 5);
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

