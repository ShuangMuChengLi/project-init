let fs = require('fs');
let path = require('path');
let _ = require('lodash');
let data = require('../public/base.json');
let list = [
  // 1.7268 / 1.2,
  // 1.7141 / 1.19,
  // 1.6995 / 1.18,
  // 1.6969 / 1.18,
  // 1.6858 / 1.18,
  // 1.6538 / 1.16,
  // 1.6564 / 1.16,
  // 1.6523 / 1.15,
  // 1.6574 / 1.16,
  // 1.6707 / 1.18,
  // 1.6428 / 1.17,
  // 1.6232 / 1.16,
  // 1.6092 / 1.15,
  1.7147 / 1.25,
];
let result = [];
list.forEach((item, index)=>{
  for(let i = 0; i < index * 3 + 1; i++){
    result.push(item);
  }
});
// 1.4353431626303357
// 1.4328649860879477
// 1.4316314981866507
data.B = _.mean(result);
let s = JSON.stringify(data, '', 2);
fs.writeFileSync(path.resolve(__dirname, '../public/base.json'), s);
fs.writeFileSync(path.resolve(__dirname, '../dist/base.json'), s);
