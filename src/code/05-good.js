let _ = require('lodash');

function main(option){
  console.log(_.get(option, 'foo.bar', 'defaultValue'));
}
main('apple');
main({
  foo:{
    bar: 'apple'
  }
});
