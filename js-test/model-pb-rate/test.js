
let _ = require('lodash');
let moment = require('moment');
let dayDataList = require('./300.json').data.item;
let {getLibRate} = require('./getAvgPb');
function getRoot(x, y) {
  return Math.pow(x, 1 / y);
}
function getHundred(n){
  return _.floor(n / 100) * 100;
}
function indexToEtf(index){
  return index * 1.898 / 3963.35;
}
function getNowDate(date){
  return moment(date || null).format('YYYY-MM-DD');
}
function main(arg){
  let options = {
    ...arg
  };
  let index = _.findIndex(dayDataList, {[0]: moment('2013-07-04 00:00:00').valueOf()});
  let list = dayDataList.slice(index);
  let asset = 50 * 10000;
  let libCount = 0; // 持仓数量
  let currentLib = libCount * indexToEtf(list[0][5]); // 持仓
  let money = asset - currentLib; // 现金
  function log(...arg){
    if(!options.log){
      return;
    }

    console.log(...arg);
  }

  for(let i = 0; i < list.length; i++){
    let item = list[i];
    let value = indexToEtf(item[5]);
    let targetRate = getLibRate(item[0]);
    currentLib = libCount * value;
    asset = money + currentLib;
    let currentRate = currentLib / asset;
    let marginCount = getHundred((targetRate - currentRate) * asset / value);
    let marginValue = marginCount * value;
    libCount += marginCount;
    currentLib = libCount * value;
    money -= marginValue;
    if(!marginCount)continue;

    log(
      '' + getNowDate(item[0]),
      '价格' + _.floor(value, 3),
      'targetRate：' + _.floor(targetRate, 3),
      'currentRate：' + _.floor(currentRate, 3),
      '持仓额：' + _.floor(currentLib),
      '持仓数量：' + _.floor(libCount),
      '买卖数量：' + _.floor(marginCount),
      '买卖金额：' + _.floor(marginValue),
      '现金：' + _.floor(money),
      '资产：' + _.floor(asset),
    );
  }

}
main({log: true});
// console.log(getNowDate(1686844800000));
