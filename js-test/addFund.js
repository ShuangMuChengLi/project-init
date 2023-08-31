let fs = require('fs');
let path = require('path');
let _ = require('lodash');
let data = require('../public/base.json');
let count = -16400;
let value = 1.846;
let code = '510310';
_.find(data.list, {code}).fund.unshift({
  count,
  value
});
let s = JSON.stringify(data, '', 2);
fs.writeFileSync(path.resolve(__dirname, '../public/base.json'), s);
fs.writeFileSync(path.resolve(__dirname, '../dist/base.json'), s);
