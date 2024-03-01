let axios = require('axios');
let fs = require('fs');
let path = require('path');
let moment = require('moment');
let date = moment().valueOf();
// 2541
// 
// 
axios.get(
  'https://legulegu.com/api/stockdata/index-basic-pb?indexCode=000300.SH&token=111665b2b9fb936b919296aa23bc40bb',
  {
    headers:{
      'Cookie': 'F79591=6811461e-0663-42d0-aef2-5f59de4b5692',
    }
  }
).then(res=>{
  console.log(res);
  // console.log(res.data);
  fs.writeFileSync(path.resolve(__dirname, './pb.json'), JSON.stringify(res.data.data, '', 2));
  fs.writeFileSync(path.resolve(__dirname, '../public/pb.json'), JSON.stringify(res.data.data, '', 2));
  fs.writeFileSync(path.resolve(__dirname, '../dist/pb.json'), JSON.stringify(res.data.data, '', 2));
}).catch(console.error);
