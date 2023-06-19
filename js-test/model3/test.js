let _ = require('lodash');
let moment = require('moment');
let dayDataList = require('./300.json').data.item;

function getRoot(x, y) {
  return Math.pow(x, 1 / y);
}
let lastItemTargetValue = _.last(dayDataList)[5] * 1.49 / 1.37;
let listDiffDays = moment(_.last(dayDataList)[0]).diff( moment(_.first(dayDataList)[0]), 'days');
let perGrowAllDay = getRoot(lastItemTargetValue / _.first(dayDataList)[5], listDiffDays); // workday 1.0002070051602752
let perGrowWorkDay = getRoot(lastItemTargetValue / _.first(dayDataList)[5], dayDataList.length);// 1.0003110317324733
function getHundred(n){
  return _.ceil(n / 100) * 100;
}
function main(arg){
  let options = {
    log: false,
    clearPartCount: 10, // 每次清仓份额
    clearUpTargetValue: 1.6, // 高估比例高估清仓阈值
    emptyClearStep: 1.1, // 空仓涨减仓时，上涨量
    gridStep: 0.02, // 网格量
    reinvestmentShare: 10, // 重新投资拆分比例
    buyRate: 1.02, // 买入比
    basePerCount: 10000, // 每次买入数量
    ...arg
  };

  function log(...arg){
    if(!options.log){
      return;
    }

    console.log(...arg);
  }
  function nolog(...arg){
  }
  function ETFToIndex(index){
    return index * 1.898 / 3963.35;
  }
  function getNowDate(date){
    return moment(date || null).format('YYYY-MM-DD');
  }
  let lib = 196200 * 1.855;
  let gridValue = ETFToIndex(dayDataList[0][5]);
  let clearValue = null;
  let clearTimes = 0;
  let targetValue = gridValue;
  let base = gridValue;
  let count = lib / gridValue;
  let money = 50 * 10000 - lib;
  let baseLib = count * base;
  let currentLib = baseLib;
  let input = baseLib; // 投入
  let total = baseLib + money;
  let inputList = [input];
  let days = 0;
  let value;
  let status = 'up';
  let profit;
  let rate;
  let valueRate;
  function getStatus(){
    if(targetValue > value){
      return 'low';
    }else{
      return 'up';
    }
  }
  function isInputEmpty(){
    return input - options.basePerCount * value < 0;
  }
  function isBuyPoint(value){
    return gridValue * (1 - options.gridStep) >= value // 低于网格0.98
      && value < targetValue * 1.3 // 价格没有过分高估
      && money >= options.basePerCount * options.buyRate * value ; // 账户有钱
  }
  function isSellPoint(value){
    return clearValue < gridValue
      && gridValue * (1 + options.gridStep) <= value // 高于网格1.02
      && value > targetValue * 0.7 // 价格没有过分低估
      && count > options.basePerCount // 持仓不为空
      && !isInputEmpty(); // 投资不为空
  }
  //{ sell: 215, buy: 184 }{ sell: 104, buy: 72 }
  let handlerCount = {
    sell:0,
    buy: 0
  };
  let firstItemMoment = moment(_.first(dayDataList)[0]);
  for(let i = 0; i < dayDataList.length; i++){
    let item = dayDataList[i];
    let nowDiffDays = moment(item[0]).diff(firstItemMoment, 'days');
    targetValue = base * Math.pow(perGrowAllDay, nowDiffDays);
    let prevCurrent = gridValue;
    days = i + 2;
    value = ETFToIndex(item[5]);

    let cost = 0, currentCostCount = 0;
    let buyPoint = isBuyPoint(value);
    let sellPoint = isSellPoint(value);
    let nowStatus = getStatus();
    // 在投资条款
    function reinvestment(){
      gridValue = value;
      if(clearTimes > options.reinvestmentShare / 2){
        cost = money / 2;
      }else{
        cost = money / options.reinvestmentShare * clearTimes;
      }
      currentCostCount = cost / value;
      count += currentCostCount;
      input += cost;
      money -= cost;
      handlerCount.buy ++;
      if(currentCostCount){
        log('reinvestment', getNowDate(item[0]), clearTimes, currentCostCount);
      }
      clearValue = null;
      clearTimes = 0;
    }
    if(buyPoint || sellPoint) {
      // log(true);
      if(buyPoint){
        if(isInputEmpty()){
          // 空仓网格买入点再投入条款
          log('空仓网格买入点再投入条款', getNowDate(item[0]));
          reinvestment();
        }else{
          clearValue = null;
          clearTimes = 0;
          currentCostCount = options.basePerCount * options.buyRate;
          handlerCount.buy ++;
          gridValue = value;
          cost = currentCostCount * value;
          count += currentCostCount;
          input += cost;
          money -= cost;
        }
      }else if(sellPoint){
        currentCostCount = -options.basePerCount;
        handlerCount.sell ++;
        gridValue = value;
        cost = currentCostCount * value;
        count += currentCostCount;
        input += cost;
        money -= cost;
      }
    } else if(nowStatus !== status){
      // log('change');
      status = nowStatus;
      // 低估空仓再投入条款
      if(status === 'low' && isInputEmpty()){
        log('低估空仓再投入条款');
        reinvestment();
      }
    }else{
      // 清仓条款
      let isClearEmpty = isInputEmpty() && gridValue * options.emptyClearStep < value && clearValue * options.emptyClearStep < value;
      let isClearUp = value > targetValue * options.clearUpTargetValue && clearValue * options.emptyClearStep < value;
      if( isClearEmpty || isClearUp ){
        let info;
        if(isClearEmpty){
          info = ('clear empty');
        }else if(isClearUp){
          info = ('clear up');
        }
        log(info, clearValue, value, getNowDate(item[0]));
        currentCostCount = -_.ceil(count / options.clearPartCount);
        count += currentCostCount;
        count = _.ceil(count / 100) * 100;
        cost = currentCostCount * value;
        input += cost;
        money -= cost;
        handlerCount.buy ++;
        clearValue = value;
        clearTimes ++;
      }
    }

    currentLib = count * value;
    if(input < 0){
      input = 0;
    }
    inputList.push(input);

    total = currentLib + money;

    if(!cost
    // && Number(getNowDate(item[0]).slice(0, 4)) < 2009
    ) continue;

    log(
      '日期：' + getNowDate(item[0]),
      '基准价格：' + _.floor(targetValue, 3),
      '网格价格：' + _.floor(prevCurrent, 3),
      '清仓价格：' + _.floor(clearValue, 3),
      '价格' + _.floor(value, 3),
      '持仓额：' + _.floor(currentLib),
      '花销：' + _.floor(cost),
      '持仓数量：' + _.floor(count),
      '花销数量：' + _.floor(currentCostCount),
      '现金：' + _.floor(money),
      '资产：' + _.floor(total),
      '投入：' + _.floor(input),
      // '成本：' + _.floor(input / count, 3)
    );
  }
  let inputPerDay = _.reduce(inputList, (sum, n)=> {
    return sum + n;
  }, 0) / days;
  profit = total - 500000;
  rate = _.floor(profit / inputPerDay * 100, 2);
  valueRate = _.floor((value - base) / base * 100, 2);
  log('盈利：' + _.floor(profit), '现价：' + gridValue, '盈利率：' + rate + '%', '沪深300盈利率：' + valueRate + '%');
  log(handlerCount);
  return {profit: _.floor(profit), rate};
}

function testMore(){
  /**
   * clearPartCount: 8, // 每次清仓份额
   clearUpTargetValue: 1.7, // 高估比例高估清仓阈值
   emptyClearStep: 1.08, // 疯狂涨减仓时，上涨量
   */
  let clearPartCountArea = null || Array(12).fill(null).map((item, index)=>{
    return 2 + index;
  });
  let clearUpTargetValueArea = [1.6] || Array(50).fill(null).map((item, index)=>{
    return 1.5 + index * 0.01;
  });
  let emptyClearStepArea = Array(50).fill(null).map((item, index)=>{
    return 1 + index * 0.01;
  });
  let nowData = null;
  let nowOption = null;
  let i = 0;
  for(let clearPartCount of clearPartCountArea){
    for(let clearUpTargetValue of clearUpTargetValueArea){
      for(let emptyClearStep of emptyClearStepArea){
        console.log(++i);
        let option = {log: false, clearPartCount, clearUpTargetValue, emptyClearStep};
        let data = main(option);
        if(!nowData){
          nowData = data;
          nowOption = option;
        }else{
          if(data.profit >= nowData.profit){
            nowData = data;
            nowOption = option;
          }
        }
      }
    }
  }
  console.log(nowData);
  console.log(nowOption);
}


// let basePerCountArea = [2500, 5000, 7500, 10000, 15000, 20000];
// let list = [];
// for(let basePerCount of basePerCountArea){
//   let option = {log: false, basePerCount};
//   let data = main(option);
//   list.push({
//     option,
//     data
//   });
//   // if(!nowData){
//   //   nowData = data;
//   //   nowOption = option;
//   // }else{
//   //   if(data.profit >= nowData.profit){
//   //     nowData = data;
//   //     nowOption = option;
//   //   }
//   // }
// }
// console.log(list);
// testMore();
main({log: true});

