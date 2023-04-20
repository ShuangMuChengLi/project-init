let _ = require('lodash');
let path = require('path');
let fs = require('fs');
let readXlsxFile = require('read-excel-file/node');
let base = require('../public/base.json');


async function main(){
  let list = [

  ];
  await readXlsxFile(path.resolve(__dirname, 'target.xlsx')).then((rows) => {
    list = rows;
    // `rows` is an array of rows
    // each row being an array of cells.
  });
  let i = 0;
  for(let item of list){
    if(i === 0) {
      i++;
      continue;
    }

    let baseItem = _.find(base, {code: item[1]});
    console.log(baseItem, item[1]);
    baseItem.target = item[8];
  }
  fs.writeFileSync(path.resolve(__dirname, '../public/base.json'), JSON.stringify(base, '', 2));
}
// File path.
main();
