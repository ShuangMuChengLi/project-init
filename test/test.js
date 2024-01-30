let base = 1.62;
let total = 0;
for(let i = 0; i < 16; i++){
  total += ((base + 0.04 * (i + 1)) * 20000);
  console.log(total, i, (base + 0.04 * (i + 1)), 0.04 * (i + 1));
}
console.log(total);