let _ = require('lodash');
let path = require('path');
let fs = require('fs');
let readXlsxFile = require('read-excel-file/node');
let base = require('../public/base.json');
let axios = require('axios');

async function main(){
  for(let item of base){
    let total = _.reduce(item.history, (sum, n)=> {
      return sum + _.floor(n.value * n.count);
    }, 0);
    item.total = total;
  }
  base = _.sortBy(base, item=>{
    return -item.total;
  });
  console.log(base);
  fs.writeFileSync(path.resolve(__dirname, '../public/base.json'), JSON.stringify(base, '', 2));
  fs.writeFileSync(path.resolve(__dirname, '../dist/base.json'), JSON.stringify(base, '', 2));
}
// File path.
main();
