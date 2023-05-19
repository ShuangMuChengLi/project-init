let _ = require('lodash');
let path = require('path');
let fs = require('fs');
let readXlsxFile = require('read-excel-file/node');
let base = require('../public/base.json');


async function main(){

  fs.writeFileSync(path.resolve(__dirname, '../public/base.json'), JSON.stringify(base, '', 2));
  fs.writeFileSync(path.resolve(__dirname, '../dist/base.json'), JSON.stringify(base, '', 2));
}
// File path.
main();
