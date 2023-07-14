let _ = require('lodash');
let moment = require('moment');
let data = require('../../../js-test/model-pb-rate/pb.json');
let index = _.findIndex(data, {date: moment('2013-07-04 00:00:00').valueOf()});
let list = data.slice(index);
let sortedList = _.sortBy(list, 'addPb');
let groupData = _.groupBy(data, 'addPb');
for(let i = 1.16; i < 2.5; i = i + 0.01){
  if(!groupData[_.round(i, 2)]){
    console.log(i);
  }
}
