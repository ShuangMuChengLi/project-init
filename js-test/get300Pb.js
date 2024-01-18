let axios = require('axios');
let fs = require('fs');
let path = require('path');
let moment = require('moment');
let date = moment().valueOf();
// 2541
// 
// 
axios.get(
  'https://legulegu.com/api/stockdata/index-basic-pb?indexCode=000300.SH&token=4ac9bc53ca651ed2739bff5ea401e0e6',
  {
    headers:{
      'Cookie': '8FDAAD5=31f1779c-df60-41ea-98d5-b3de96c48506',
    }
  }
).then(res=>{
  console.log(res);
  // console.log(res.data);
  fs.writeFileSync(path.resolve(__dirname, './pb.json'), JSON.stringify(res.data.data, '', 2));
  fs.writeFileSync(path.resolve(__dirname, '../public/pb.json'), JSON.stringify(res.data.data, '', 2));
  fs.writeFileSync(path.resolve(__dirname, '../dist/pb.json'), JSON.stringify(res.data.data, '', 2));
}).catch(console.error);
