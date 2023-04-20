function obj(){

}
obj.prototype.name = '林';
let p = new obj();
let p2 = new obj();
p.__proto__.name = '张';
console.log(p2.name);