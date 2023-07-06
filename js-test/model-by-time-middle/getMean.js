
let _ = require('lodash');
let path = require('path');
let moment = require('moment');
let dayDataList = require('./300.json').data.item;
let fs = require('fs');
function getRoot(x, y) {
  return Math.pow(x, 1 / y);
}
function indexToEtf(index){
  return index * 1.898 / 3963.35;
}
function getNowDate(date){
  return moment(date || null).format('YYYY-MM-DD');
}
const middlePB = 1.49;
const currentPB = 1.37;
const meanUpRate = 1.4954727921498616;
let lastItemMiddleValue = _.last(dayDataList)[5] * middlePB / currentPB ;// 最后一项时间的中位价
let lastItemTargetValue = lastItemMiddleValue;
// const meanUpRate = 1.6043623869782295;
// let lastItemTargetValue = _.last(dayDataList)[5];// 最后一项时间的目标价
let listDiffDays = moment(_.last(dayDataList)[0]).diff( moment(_.first(dayDataList)[0]), 'days'); // 列表天数范围
let perGrowAllDay = getRoot(lastItemTargetValue / _.first(dayDataList)[5], listDiffDays); // 日均上涨幅度
let firstItemMoment = moment(_.first(dayDataList)[0]); // 第一项的日期moment对象
function main(arg){
  let options = {
    log: false,
    basePerSellValue: 8000, // 每次卖出价格
    buyPointRate: 0.9,
    sellPointRate: 1.9,
    girdSellDiffDay: 1,
    ...arg
  };
  let base = indexToEtf(dayDataList[0][5]); // 网格价格
  let value; // 当前价格
  let changedList = [];
  let upRateList = [];
  let diffToMeanUpRateList = [];
  for(let i = 0; i < dayDataList.length; i++) {
    let item = dayDataList[i];
    value = indexToEtf(item[5]);

    // 获取目前合理价格
    let currentMoment = moment(item[0]);
    let nowDiffDays = currentMoment.diff(firstItemMoment, 'days');
    let innerValue = base * Math.pow(perGrowAllDay, nowDiffDays);
    let targetValue = innerValue * meanUpRate;
    changedList.push({
      value: value,
      base: innerValue,
      targetValue: targetValue,
      date: getNowDate(item[0])
    });
    let upRate = value / targetValue;
    upRateList.push(upRate);
    let diffToMeanUpRate = upRate / meanUpRate;
    diffToMeanUpRateList.push(diffToMeanUpRate);
  }
  // console.log(upRateList, diffToMeanUpRateList);
  fs.writeFileSync(path.resolve(__dirname, 'changedList.json'), JSON.stringify(changedList, '', 2));
}
main({log: true, noEmptyConsole: true});
