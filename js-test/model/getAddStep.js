module.exports = function getAddStep(currentStep){
  let addStep;
  if(currentStep === 0){
    addStep = 0;
  }else{
    addStep = currentStep / Math.abs(currentStep) * (Math.abs(currentStep) - 1);
  }
  return addStep;
}
