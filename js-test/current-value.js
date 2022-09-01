let current = require('./value-current.json');
let fs = require('fs');
let path = require('path');
for(let key in current){
  let item = current[key];
  item.pre = item.value / item.count;
}
fs.writeFileSync(path.resolve(__dirname, 'current.json'), JSON.stringify(current, '', 2));
