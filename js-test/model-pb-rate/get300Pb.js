let axios = require('axios');
let fs = require('fs');
let path = require('path');
let moment = require('moment');
let date = moment().valueOf();
axios.get(
  `https://legulegu.com/api/stockdata/index-basic-pb?indexCode=000300.SH&token=13fed5c4c3cb0f9dcf8d2f27f024d5cf`,
  {
    headers:{
      'Cookie': `E197A88=116e003f-f215-40e4-85ae-99f85980efa8;`.replace(/\s/g, ''),
      // 'Host': 'legulegu.com',
      // 'Referer': 'https://legulegu.com/stockdata/hs300-pb',

    }
  }
).then(res=>{
  // console.log(res);
  // console.log(res.data);
  fs.writeFileSync(path.resolve(__dirname, './pb.json'), JSON.stringify(res.data.data, '', 2));
}).catch(console.error);
