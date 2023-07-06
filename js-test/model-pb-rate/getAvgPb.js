let data = require('./pb.json');
let _ = require('lodash');
let moment = require('moment');
module.exports = {
  getLibRate(date){
    let index = _.findIndex(data, {date: moment('2013-07-04 00:00:00').valueOf()});
    let list = data.slice(index);
    let sortedList = _.sortBy(list, 'addPb');
    let positionIndex = _.findIndex(sortedList, {date: date});
    if(positionIndex === -1)return false;

    let libRate = 1 - positionIndex / sortedList.length;
    return libRate;
  }
};

