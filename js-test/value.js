let _ = require('lodash');
let path = require('path');
let fs = require('fs');
let readXlsxFile = require('read-excel-file/node');

let list = [

];
async function main(){
  await readXlsxFile(path.resolve(__dirname, 'value.xlsx')).then((rows) => {
    list = rows;
    // `rows` is an array of rows
    // each row being an array of cells.
  });
  let group = _.groupBy(list, (item)=>{
    return item[0];
  });
  let result = {};
  for(let key in group){
    let subList = group[key];
    let count = 0;
    for(let item of subList){
      count += item[2] * item[3];
    }
    result[key] = {
      count: -count
    };
  }
  fs.writeFileSync(path.resolve(__dirname, 'value.json'), JSON.stringify(result, '', 2));
}
// File path.
main();
