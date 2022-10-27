let _ = require('lodash');
let path = require('path');
let fs = require('fs');
let readXlsxFile = require('read-excel-file/node');
let data = require('./level.json');

async function main(){
  let list = await readXlsxFile(path.resolve(__dirname, '2.xlsx')).then((rows) => {
    return rows;
  });
  let result = [];
  for(let i = 1; i < list.length; i++){
    let item = list[i];

    let value = item[6];
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
      current: findItem.current,
      positionList: positionList,
    });
  }
  fs.writeFileSync(path.resolve(__dirname, 'positionList.json'), JSON.stringify(result, '', 2));
}
// File path.
main();
