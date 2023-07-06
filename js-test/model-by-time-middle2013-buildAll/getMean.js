
let path = require('path');
let fs = require('fs');
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
    basePerSellValue: 8000, // 每次卖出价格
    buyPointRate: 1,
    sellPointRate: 1,
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

  function verifyIsBuyPoint(value, innerValue){
    return money >= 0 // 账户有钱
      && value < innerValue * options.buyPointRate;
  }
  function verifyIsSellPoint(value, innerValue, currentMoment){
    return libCount >= options.basePerSellValue / value // 持仓不为空
      && value >= innerValue
      && (sellPointMoment === null || currentMoment.diff(sellPointMoment, 'days') >= options.girdSellDiffDay);
  }
  let handlerCount = {
    sell:0,
    buy: 0
  };
  let changedList = [];
  for(let i = 0; i < dayDataList.length; i++) {
    let item = dayDataList[i];
    value = indexToEtf(item.close);
    let currentCost = 0;
    let currentCostCount = 0;


    // 获取目前合理价格
    let currentMoment = moment(item.date);
    let nowDiffDays = currentMoment.diff(firstItemMoment, 'days');
    let innerValue = base * Math.pow(perGrowAllDay, nowDiffDays);
    changedList.push({
      value: value,
      base: innerValue,
      date: getNowDate(item.date)
    });
  }
  fs.writeFileSync(path.resolve(__dirname, 'changedList.json'), JSON.stringify(changedList, '', 2));
}
main({log: true, noEmptyConsole: false});
