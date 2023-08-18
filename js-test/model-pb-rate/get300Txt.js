let data = require('./HS300.json');
let fs = require('fs');
let path = require('path');

let txtList = [];
for(let item of data){
  txtList.push(item.code);
}
fs.writeFileSync(path.resolve(__dirname, './HS300.txt'), txtList.join('\n'));