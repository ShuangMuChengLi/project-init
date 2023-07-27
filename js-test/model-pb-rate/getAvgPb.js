let data = require('./pb.json');
let _ = require('lodash');
let moment = require('moment');
let index = _.findIndex(data, {date: moment('2013-07-04 00:00:00').valueOf()});
let list = data.slice(index);
let sortedList = _.sortBy(list, 'addPb');
let groupData = _.groupBy(list, 'addPb');
let b = 1.899 / 1.38;
module.exports = {
  getLibRate(pb, current){
    let floorPrice = _.floor(_.floor(pb, 2) * b, 3);
    let positionIndex = -1;
    for(let index = 0; index < sortedList.length; index++){
      positionIndex = index;

      if(sortedList[index].addPb >= pb){
        break;
      }

    }
    positionIndex = positionIndex + groupData[_.floor(pb, 2)].length * (current - floorPrice) / (b / 100);
    let rate = 1 - positionIndex / sortedList.length;
    return rate;
  }
};

