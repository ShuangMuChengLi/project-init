
let _ = require('lodash');
let moment = require('moment');
let dayDataList = require('./pb.json').data;
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
let lastItemMiddleValue = _.last(dayDataList).close * middlePB / currentPB ;// 最后一项时间的中位价
let lastItemTargetValue = lastItemMiddleValue;
// let lastItemTargetValue = _.last(dayDataList).close;// 最后一项时间的目标价
let listDiffDays = moment(_.last(dayDataList).date).diff( moment(_.first(dayDataList).date), 'days'); // 列表天数范围
let perGrowAllDay = getRoot(lastItemTargetValue / _.first(dayDataList).close, listDiffDays); // 日均上涨幅度
let firstItemMoment = moment(_.first(dayDataList).date); // 第一项的日期moment对象
function main(arg){
  let options = {
    log: false,
    basePerBuyValue: 10000, // 每次卖出价格
    basePerSellValue: 10000, // 每次卖出价格
    buyPointRate: 1,
    sellPointRate: 1,
    girdBuyDiffDay: 1.2,
    girdSellDiffDay: 1,
    ...arg
  };
  let base = indexToEtf(dayDataList[0].close); // 基准价格，用于获取合理价格
  let libCount = getHundred(196200 * 1.855 / base); // 持仓数量
  // let libCount = getHundred(0 / gridValue); // 持仓数量
  let baseLib = libCount * base; // 基准持仓
  let money = 50 * 10000 - baseLib; // 现金
  let currentLib = baseLib; // 当前持仓
  let total = baseLib + money; // 净资产
  let value; // 当前价格
  let profit; // 收益
  let inputList = []; // 投资栈
  let sellPointMoment = null;
  let buyPointMoment = null;
  function log(...arg){
    if(!options.log){
      return;
    }

    console.log(...arg);
  }

  function verifyIsBuyPoint(value, innerValue, currentMoment){
    return money >= options.basePerBuyValue // 账户有钱
      && value < innerValue * options.buyPointRate
      && (buyPointMoment === null || currentMoment.diff(buyPointMoment, 'days') >= options.girdBuyDiffDay);
  }
  function verifyIsSellPoint(value, innerValue, currentMoment){
    return libCount >= options.basePerSellValue / value // 持仓不为空
        && value >= innerValue * options.sellPointRate
        && (sellPointMoment === null || currentMoment.diff(sellPointMoment, 'days') >= options.girdSellDiffDay);
  }
  let handlerCount = {
    sell:0,
    buy: 0
  };
  let upRateList = [];
  for(let i = 0; i < dayDataList.length; i++){
    let item = dayDataList[i];
    value = indexToEtf(item.close);
    let currentCost = 0;
    let currentCostCount = 0;


    // 获取目前合理价格
    let currentMoment = moment(item.date);
    let nowDiffDays = currentMoment.diff(firstItemMoment, 'days');
    let innerValue = base * Math.pow(perGrowAllDay, nowDiffDays);
    // 判断买入点
    let isBuyPoint = verifyIsBuyPoint(value, innerValue, currentMoment);
    // 判断卖出点
    let isSellPoint = verifyIsSellPoint(value, innerValue, currentMoment);

    function calcResult(currentCostCount){
      currentCost = currentCostCount * value; // 当前花销金额
      money -= currentCost; // 当前现金
      libCount += currentCostCount; // 当前持仓数量
      currentLib = libCount * value; // 当前持仓金额
      total = currentLib + money; // 总资产
    }
    if(isSellPoint || isBuyPoint){
      if(isSellPoint){
        handlerCount.sell ++;
        // currentCostCount = -options.basePerCount;
        currentCostCount = -options.basePerSellValue / value;
        sellPointMoment = currentMoment;
        buyPointMoment = null;
      }else if(isBuyPoint){
        handlerCount.buy ++;
        currentCostCount = options.basePerBuyValue / value;
        buyPointMoment = currentMoment;
        sellPointMoment = null;
      }
    }
    calcResult(currentCostCount);
    if(currentLib > 0){
      inputList.push(currentLib);
    }
    if(!currentCost && options.noEmptyConsole) continue;

    log(
      '日期：' + getNowDate(item.date),
      '基准价格：' + _.floor(innerValue, 3),
      // 'buyPointMoment：' + getNowDate(buyPointMoment),
      // 'sellPointMoment：' + getNowDate(sellPointMoment),
      '价格：' + _.floor(value, 3),
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
  let years = _.ceil(moment(_.last(dayDataList).date).diff( moment(_.first(dayDataList).date), 'years'));
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
  // console.log(_.mean(upRateList)); // 平均高估值
  return {profit: _.floor(profit)};
}
function testMore(){
  /**
   basePerSellValue: 11000, // 每次卖出价格
   sellPointRate: 1,
   girdSellDiffDay: 3,
   */
  let emptyList = [1];
  let area1 = null || Array(20).fill(null).map((item, index)=>{
    return index * 1000 + 1000;
  });
  let area2 = null || Array(20).fill(null).map((item, index)=>{
    return 0.1 * index;
  });
  let area3 = null || Array(5).fill(null).map((item, index)=>{
    return index + 1;
  });
  let area4 = null || Array(10).fill(null).map((item, index)=>{
    return 0.1 * index;
  });
  let nowData = null;
  let nowOption = null;
  let days = 0;
  let i = 0;
  for(let areaItem1 of area1){
    for(let areaItem2 of area2){
      for(let areaItem3 of area3){
        for(let areaItem4 of area4) {
        // for(let emptyClearStep of emptyClearStepArea){
          if(i % 200 === 0){
            console.log(i);
          }
          ++i;
          let option = {
            log: false,
            basePerSellValue: areaItem1,
            sellPointRate: areaItem2,
            girdSellDiffDay: areaItem3,
            empty: areaItem4
          };
          let data = main(option);
          if (!nowData) {
            nowData = data;
            nowOption = option;
          } else {
            if (data.profit >= nowData.profit) {
              nowData = data;
              nowOption = option;
            }
          }
        }
      // }
      }
    }
  }
  console.log(nowData);
  console.log(nowOption);
}
// testMore();
main({log: true, noEmptyConsole: true});
