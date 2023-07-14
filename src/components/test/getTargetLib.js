
let _ = require('lodash');
let moment = require('moment');
let data = require('../../../js-test/model-pb-rate/pb.json');
function getNowDate(date){
  return moment(date || null).format('YYYY-MM-DD');
}
// getLibRate(pb, b, floorPrice, currentData.current)
export function getLibRate(pb, b, floorPrice, current){
  let index = _.findIndex(data, {date: moment('2013-07-04 00:00:00').valueOf()});
  let list = data.slice(index);
  let sortedList = _.sortBy(list, 'addPb');
  let groupData = _.groupBy(list, 'addPb');

  let positionIndex = -1;
  for(let index = 0; index < sortedList.length; index++){
    positionIndex = index;

    if(sortedList[index].addPb >= pb){
      break;
    }

  }
  console.log(positionIndex);
  positionIndex = positionIndex + groupData[_.floor(pb, 2)].length / ((current - floorPrice) / b * 100);
  console.log(positionIndex);
  let rate = 1 - positionIndex / sortedList.length;
  return {
    rate: rate,
  };
}

export function getHistoryData(){
  let index = _.findIndex(data, {date: moment('2013-07-04 00:00:00').valueOf()});
  let list = data.slice(index);
  let groupData = _.groupBy(list, 'addPb');
  let result = [];
  let b = 1.873 / 1.34;
  for(let key in groupData){
    result.push({
      key,
      value: groupData[key].length,
      price: _.floor(b * key, 3)
    });
  }
  result = _.sortBy(result, 'key');
  return result;
}
