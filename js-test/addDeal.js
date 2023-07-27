let fs = require('fs');
let path = require('path');
let _ = require('lodash');
let data = require('../public/base.json');
let count = 0;
let value = 0;
let code = '510310';
_.find(data.list, {code}).history.unshift({
  count,
  value
});
data.money += _.floor(-count * value);
let s = JSON.stringify(data, '', 2);
fs.writeFileSync(path.resolve(__dirname, '../public/base.json'), s);
fs.writeFileSync(path.resolve(__dirname, '../dist/base.json'), s);
