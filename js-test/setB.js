let fs = require('fs');
let path = require('path');
let _ = require('lodash');
let data = require('../public/base.json');
data.B = 1.7403 / 1.21;
let s = JSON.stringify(data, '', 2);
fs.writeFileSync(path.resolve(__dirname, '../public/base.json'), s);
fs.writeFileSync(path.resolve(__dirname, '../dist/base.json'), s);
