let data = require('./pb.json');
let _ = require('lodash');
let moment = require('moment');
let b = 1.853 / 1.32;
console.log(b);
function main(list){
  let mean = _.meanBy(list, 'addPb');
  console.log(mean);
  let sortedList = _.sortBy(list, 'addPb');
  console.log(sortedList[_.floor(sortedList.length / 3)].addPb);
  console.log(sortedList[_.floor(sortedList.length / 2)].addPb);
  console.log(sortedList[_.floor(sortedList.length / 3 * 2)].addPb);
  let currentPb = _.floor(1.873 / b, 2);
  console.log(currentPb);
  let positionIndex = _.findIndex(sortedList, {addPb: currentPb});
  console.log(_.floor(positionIndex / sortedList.length * 100, 2));
}
let index = _.findIndex(data, {date: moment('2013-07-04 00:00:00').valueOf()});
let list = data.slice(index);
main(list);
