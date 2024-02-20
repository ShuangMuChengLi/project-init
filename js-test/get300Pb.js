let axios = require('axios');
let fs = require('fs');
let path = require('path');
let moment = require('moment');
let date = moment().valueOf();
// 2541
// 
// 
axios.get(
  'https://legulegu.com/api/stockdata/index-basic-pb?indexCode=000300.SH&token=d9efc2e772b67d63c39298bb8463e84f',
  {
    headers:{
      'Cookie': '45096384=f26acd6c-2708-4b0f-9073-9ee42c215986',
    }
  }
).then(res=>{
  console.log(res);
  // console.log(res.data);
  fs.writeFileSync(path.resolve(__dirname, './pb.json'), JSON.stringify(res.data.data, '', 2));
  fs.writeFileSync(path.resolve(__dirname, '../public/pb.json'), JSON.stringify(res.data.data, '', 2));
  fs.writeFileSync(path.resolve(__dirname, '../dist/pb.json'), JSON.stringify(res.data.data, '', 2));
}).catch(console.error);
