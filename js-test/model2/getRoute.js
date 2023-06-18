let _ = require('lodash');
function getRoute(){
  let routes = [];
  let currentStep = 0;
  for(let i = 0; i < 242 / 2 * 20; i++){
    let random = _.random(1, 100);
    if(random <= 40 + currentStep * 2){
      random = -1;
    }else{
      random = 1;
    }
    currentStep = currentStep + random;
    routes.push(random);
  }
  return routes;
}

module.exports = getRoute;
