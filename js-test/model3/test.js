let _ = require('lodash');
let moment = require('moment');
let dayDataList = require('./300.json').data.item;

function main(arg){
  let options = {
    log: false,
    clearPartCount: 11, // 每次清仓份额
    clearUpTargetValue: 2.54, // 高估比例高估清仓阈值
    emptyClearStep: 1.02, // 疯狂涨减仓时，上涨量
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
  let perGrow = Math.pow(_.last(dayDataList)[5] / _.first(dayDataList)[5], 1 / dayDataList.length);
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
  for(let i = 0; i < dayDataList.length; i++){
    let prevCurrent = gridValue;
    targetValue = base * Math.pow(perGrow, i);
    days = i + 2;
    let item = dayDataList[i];
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
          log('空仓网格买入点再投入条款');
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
      if(
        isInputEmpty() && gridValue * options.emptyClearStep < value && clearValue * options.emptyClearStep < value
        || value > targetValue * options.clearUpTargetValue && clearValue * options.emptyClearStep < value
      ){
        let info;
        if(isInputEmpty() && gridValue * options.emptyClearStep < value && clearValue * options.emptyClearStep < value){
          info = ('clear empty');
        }else if(value > targetValue * options.clearUpTargetValue && clearValue * options.emptyClearStep < value){
          info = ('clear up');
        }
        log(info, clearValue, value, getNowDate(item[0]));
        clearValue = value;
        clearTimes ++;
        currentCostCount = -_.floor(count / options.clearPartCount);
        count += currentCostCount;
        cost = currentCostCount * value;
        input += cost;
        money -= cost;
        handlerCount.buy ++;
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

/**
 * clearPartCount: 9, // 每次清仓份额
 clearUpTargetValue: 2.03, // 高估比例高估清仓阈值
 emptyClearStep: 1.02, // 疯狂涨减仓时，上涨量
 */
// let clearPartCountArea = Array(20).fill(null).map((item, index)=>{
//   return index + 1;
// });
// let clearUpTargetValueArea = Array(300).fill(null).map((item, index)=>{
//   return 1 + index * 0.01;
// });
// let emptyClearStepArea = Array(20).fill(null).map((item, index)=>{
//   return 1 + index * 0.01;
// });
// let nowData = null;
// let nowOption = null;
// let i = 0;
// for(let clearPartCount of clearPartCountArea){
//   for(let clearUpTargetValue of clearUpTargetValueArea){
//     for(let emptyClearStep of emptyClearStepArea){
//       console.log(++i);
//       let option = {log: false, clearPartCount, clearUpTargetValue, emptyClearStep};
//       let data = main(option);
//       if(!nowData){
//         nowData = data;
//         nowOption = option;
//       }else{
//         if(data.profit >= nowData.profit){
//           nowData = data;
//           nowOption = option;
//         }
//       }
//     }
//   }
// }
// console.log(nowData);
// console.log(nowOption);
// console.log(_.maxBy(list, item=>item.profit));
// // 盈利：2037830 现价：1.898 盈利率：592.45% 沪深300盈利率：303.27%
// // 盈利：2565163 现价：1.898 盈利率：433.88% 沪深300盈利率：303.27%
main({log: true, clearUpTargetValue: 2.54});

