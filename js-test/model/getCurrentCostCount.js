let basePerCount = 5000;
let basePerAddCount = 0;
module.exports = function getCurrentCostCount(route, addStep, statistics, current, count, target){
  let currentCostCount;
  let rate;
  if(route > 0){
    statistics.positive ++;
    currentCostCount = -(Math.abs(addStep) * basePerAddCount + basePerCount);
    rate = 1.02;
  }else{
    statistics.negative ++;
    currentCostCount = Math.abs(addStep) * basePerAddCount + basePerCount;
    rate = 0.98;
  }
  current = current * rate;
  if(current >= target){
    currentCostCount = -count;
  }
  return {
    currentCostCount,
    rate,
    value: current
  };
};

