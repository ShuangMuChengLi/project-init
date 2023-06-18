let list = Array(10).fill(1);
console.log(Array(10).fill(null).map((item, index)=>{
  console.log(index);
  return index + 1;
}))
console.log(list);
