let _ = require('lodash');
let routes = [];
for(let i = 0; i < 242 / 2 * 20; i++){
  let random = _.random(1, 10);
  if(random <= 5){
    random = -1;
  }else{
    random = 1;
  }
  routes.push(random);
}
module.exports = routes;
