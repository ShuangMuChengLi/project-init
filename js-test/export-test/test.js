// let my = require('./export-test').myModule;
// let {_} = require('lodash');
// let { value } = require('./export');
// let defaultValue = require('./export');
// my();
// console.log(exports);
// console.log(module);
// console.log(value, defaultValue);
// console.log(this, global)
// console.log(this === global)
// function fn(){
//   console.log(this === global)
// }
// fn();
import {myModule} from './export-test';
console.log(myModule);
