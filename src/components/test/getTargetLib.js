import {getB} from './getB';
import _ from 'lodash';
import axios from 'axios';
import moment from 'moment';
let b = getB();
let sortedList;
let groupData;
export async function initPb(){
  let data = await axios.get('./pb.json').then((res)=>{
    return res.data;
  }).catch(err=>false) || [];
  console.log(data);
  if(!data)return;

  let index = _.findIndex(data, {date: moment('2013-07-04 00:00:00').valueOf()});
  let list = data.slice(index);
  sortedList = _.sortBy(list, 'addPb');
  groupData = _.groupBy(list, 'addPb');
}


export function getLibRate(pb, current){

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
  return {
    rate: rate,
  };
}

export function getHistoryData(count, money, currentValue){
  let result = [];
  function getHundred(n){
    return _.floor(n / 100) * 100;
  }
  for(let key in groupData){
    let positionIndex = _.findIndex(sortedList, {addPb: Number(key)});
    let rate = 1 - positionIndex / sortedList.length;
    let price = b * key;
    let marginValue = _.floor(price * count - (price * count + money) * rate);
    let marginCount = getHundred(marginValue / price);
    let profit = Math.abs(_.floor((price - currentValue) * marginCount));
    // if(key === '1.48'){
    //   console.log(marginCount, price - currentValue);
    // }
    result.push({
      key,
      value: groupData[key].length,
      rate: _.floor(rate * 100, 2),
      marginValue: _.floor(marginValue),
      marginCount: _.floor(marginCount, 2),
      profit: profit,
      price: _.floor(price, 3)
    });
  }
  result = _.sortBy(result, 'key');
  return result;
}

export function getTargetPriceByLib(lib){
  let index = _.floor(sortedList.length * (100 - lib) / 100);
  let item = sortedList[index];
  let floorIndex = _.findIndex(sortedList, {addPb: item.addPb});
  let marginPb = (index - floorIndex) / groupData[item.addPb].length * 0.01;
  return _.floor((item.addPb + marginPb) * b, 3);
}
