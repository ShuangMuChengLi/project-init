let axios = require('axios');
let fs = require('fs');
let path = require('path');
let moment = require('moment');
let date = moment().valueOf();
// 近十年更低估天数30，总数2523
// 近十年更低估天数30，总数2525
axios.get(
  'https://legulegu.com/api/stockdata/index-basic-pb?indexCode=000300.SH&token=b5dd5d823f40453bebd2d92fac3186d1',
  {
    headers:{
      'Cookie': '0B469FF1=5994d141-b1f1-4083-bd3c-9134a31b01eb'.replace(/\s/g, ''),
      // 'Host': 'legulegu.com',
      // 'Referer': 'https://legulegu.com/stockdata/hs300-pb',

    }
  }
).then(res=>{
  console.log(res);
  // console.log(res.data);
  fs.writeFileSync(path.resolve(__dirname, './pb.json'), JSON.stringify(res.data.data, '', 2));
  fs.writeFileSync(path.resolve(__dirname, '../../public/pb.json'), JSON.stringify(res.data.data, '', 2));
  fs.writeFileSync(path.resolve(__dirname, '../../dist/pb.json'), JSON.stringify(res.data.data, '', 2));
}).catch(console.error);
