//Longhand
function addBad(test1, test2) {
  if (!test1)
    test1 = 1;
  if (!test2)
    test2 = 2;
  return test1 + test2;
}
//shorthand
let addGood = (test1 = 1, test2 = 2) => (test1 + test2);
