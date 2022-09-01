let _ = require('lodash');
let path = require('path');
let fs = require('fs');
let readXlsxFile = require('read-excel-file/node');
let base = require('./base.json');
let list = [

];
async function main(){
  await readXlsxFile(path.resolve(__dirname, '2.xlsx')).then((rows) => {
    list = rows;
    // `rows` is an array of rows
    // each row being an array of cells.
  });
  let rate = 0.1;
  function fn(item){
    let levelList = [];
    let d = item[5] * rate;
    for(let i = -6; i <= 6; i++){
      levelList.push(_.ceil(item[5] + d * i, 2));
    }
    return levelList;
  }
  let result = [];
  for(let item of list){
    result.push({
      name: item[0],
      code: item[1],
      value: item[5],
      list: fn(item)
    });
  }
  fs.writeFileSync(path.resolve(__dirname, 'data.json'), JSON.stringify(result, '', 2));
}
// File path.
main();
