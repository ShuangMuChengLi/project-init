let fs = require('fs');
let path = require('path');
fs.copyFileSync(path.resolve(__dirname, './HS300.json'), path.resolve(__dirname, '../dist/HS300.json'));