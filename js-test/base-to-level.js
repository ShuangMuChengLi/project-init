let _ = require('lodash');
let path = require('path');
let fs = require('fs');
let readXlsxFile = require('read-excel-file/node');
let base = require('./base.json');
let list = [

];
async function main(){
  let rate = 0.15;
  function fn(value){
    let levelList = [];
    let d = value * rate;
    for(let i = -6; i <= 6; i++){
      levelList.push(_.ceil(value + d * i, 2));
    }
    return levelList;
  }
  let result = [];
  for(let item of base){
    result.push({
      ...item,
      list: fn(item.value)
    });
  }
  fs.writeFileSync(path.resolve(__dirname, 'level.json'), JSON.stringify(result, '', 2));
}
// File path.
main();
