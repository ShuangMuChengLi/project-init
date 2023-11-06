let axios = require('axios');
let fs = require('fs');
let path = require('path');
let moment = require('moment');
let date = moment().valueOf();
axios.get(
  'https://legulegu.com/api/stockdata/index-basic-pb?indexCode=000300.SH&token=936759be5ca9f1da2f90e366fec11e11',
  {
    headers:{
      'Cookie': '11C36D0=5c86ca64-1858-4715-9f3d-5ec909378bdb'.replace(/\s/g, ''),
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
