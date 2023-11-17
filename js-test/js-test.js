let dayjs = require('dayjs');
for(let i = 0; i <= 100000; i++){
  if(i === 0 || i === 100000){
    console.log( dayjs().format('YYYY-MM-DD HH:mm:ss'));
  }else{
    dayjs().format('YYYY-MM-DD HH:mm:ss');
  }
    
}
