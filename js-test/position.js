let _ = require('lodash');
let path = require('path');
let fs = require('fs');
let readXlsxFile = require('read-excel-file/node');
let data = require('./level.json');
let list = [

];
async function main(){
  await readXlsxFile(path.resolve(__dirname, '2.xlsx')).then((rows) => {
    list = rows;
    // `rows` is an array of rows
    // each row being an array of cells.
  });
  let result = [];
  for(let item of list){
    let value = item[5];
    let name = item[0];
    let findItem = _.find(data, {code: item[1]});
    if(!findItem){
      console.log(data, item[0]);
      continue;
    }

    let rangeList = findItem.list;
    let positionList = [];
    let isSet = false;
    rangeList.forEach((rangeItem, i)=>{
      if(!isSet && rangeItem > value){
        isSet = true;
        positionList.push(value);
        positionList.push(rangeItem);
      }else{
        positionList.push('-');
        positionList.push(rangeItem);
      }

      if(i === rangeList.length - 1){
        if(!isSet){
          positionList.push(value);
        }else{
          positionList.push('-');
        }
      }
    });
    result.push({
      name: name,
      value: value,
      list: rangeList,
      positionList: positionList,
    });
  }
  fs.writeFileSync(path.resolve(__dirname, 'positionList.json'), JSON.stringify(result, '', 2));
}
// File path.
main();
