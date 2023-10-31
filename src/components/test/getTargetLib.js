
import _ from 'lodash';
import axios from 'axios';
import moment from 'moment';
let b;
let sortedList;
let groupData;
export async function initPb(){
  let data = await axios.get('./pb.json').then((res)=>{
    return res.data;
  }).catch(err=>false) || [];
  if(!data)return;

  let index = _.findIndex(data, {date: moment('2013-07-04 00:00:00').valueOf()});
  let list = data.slice(index);
  sortedList = _.sortBy(list, 'addPb');
  groupData = _.groupBy(list, 'addPb');
}

let libRateMap = [
  { pbRate: 0, minLibRate: 0, maxLibRate: 0 },
  { pbRate: 10, minLibRate: 0, maxLibRate: 0 },
  { pbRate: 20, minLibRate: 0, maxLibRate: 5 },
  { pbRate: 30, minLibRate: 0, maxLibRate: 10 },
  { pbRate: 40, minLibRate: 0, maxLibRate: 20 },
  { pbRate: 50, minLibRate: 10, maxLibRate: 50 },
  { pbRate: 60, minLibRate: 20, maxLibRate: 70 },
  { pbRate: 70, minLibRate: 30, maxLibRate: 80 },
  { pbRate: 80, minLibRate: 50, maxLibRate: 90 },
  { pbRate: 90, minLibRate: 70, maxLibRate: 100 },
  { pbRate: 100, minLibRate: 100, maxLibRate: 100 }
];

export function getLibRate(pb, current, b){

  let positionIndex = -1;
  let floorPb = _.floor(pb, 2);
  let floorPrice = floorPb * b;
  for(let index = 0; index < sortedList.length; index++){
    positionIndex = index;

    if(sortedList[index].addPb >= floorPb){
      break;
    }

  }
  positionIndex = positionIndex + groupData[floorPb].length * (current - floorPrice) / (b / 100);
  let rate = 1 - positionIndex / sortedList.length;
  let baseRate = _.floor(rate * 10) * 10;
  let libTargetRate = _.find(libRateMap, {pbRate: baseRate});
  return {
    rate: rate,
    positionIndex: _.floor(positionIndex),
    total: sortedList.length,
    minLibRate: libTargetRate.minLibRate,
    maxLibRate: libTargetRate.maxLibRate,
  };
}

export function getHistoryData(b){
  let result = [];
  for(let key in groupData){
    let positionIndex = _.findIndex(sortedList, {addPb: Number(key)});
    let rate = 1 - positionIndex / sortedList.length;
    let price = b * key;
    result.push({
      key,
      value: groupData[key].length,
      rate: _.floor(rate * 100, 2),
      price: _.floor(price, 3)
    });
  }
  result = _.sortBy(result, 'key');
  return result;
}
