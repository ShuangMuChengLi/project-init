let axios = require('axios');
let fs = require('fs');
let path = require('path');
let moment = require('moment');
let date = moment().valueOf();
axios.get(
  'https://legulegu.com/api/stockdata/index-basic-pb?indexCode=000300.SH&token=0e084fcd70183e74eb8803c7b5c8d33d',
  {
    headers:{
      'Cookie': 'D85C16=57d2c8af-3b0c-4401-9c98-0e300856e13a'.replace(/\s/g, ''),
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
