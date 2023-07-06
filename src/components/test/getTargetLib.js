
let _ = require('lodash');
let moment = require('moment');
let data = require('../../../js-test/model-pb-rate/pb.json');
function getNowDate(date){
  return moment(date || null).format('YYYY-MM-DD');
}
export function getLibRate(pb){
  let index = _.findIndex(data, {date: moment('2013-07-04 00:00:00').valueOf()});
  let list = data.slice(index);
  let sortedList = _.sortBy(list, 'addPb');

  let positionIndex = -1;
  for(let index = 0; index < sortedList.length; index++){
    positionIndex = index;

    if(sortedList[index].addPb >= pb){
      break;
    }

  }

  return {
    rate: 1 - positionIndex / sortedList.length,
    data: sortedList[positionIndex]
  };
}

export function getHistoryData(){
  let groupData = _.groupBy(data, 'addPb');
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
