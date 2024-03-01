let base = 1.72;
let money = 0;
for(let i = 0 ; i < 33; i ++){
  base += 0.04;
  money += base * 10000;
  console.log(i + 1, base, money);
}