let axios = require('axios');
let fs = require('fs');
let path = require('path');
let moment = require('moment');
let date = moment().valueOf();
axios.get(
  'https://legulegu.com/api/stockdata/index-basic-pb?indexCode=000300.SH&token=32a37d683f49c501836bfa2daf913acc',
  {
    headers:{
      'Cookie': '8A217B67=9361522e-b2bb-476e-9361-91599fd73f54'.replace(/\s/g, ''),
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
