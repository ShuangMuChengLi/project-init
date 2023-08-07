let axios = require('axios');
let fs = require('fs');
let path = require('path');
let moment = require('moment');
let date = moment().valueOf();
axios.get(
  `https://legulegu.com/api/stockdata/index-basic-pb?indexCode=000300.SH&token=8dd709addf045d14b34c71b643aea78d`,
  {
    headers:{
      'Cookie': `9B8FC7E=38b20c43-3af1-4714-a0fc-32a227893917;`.replace(/\s/g, ''),
      // 'Host': 'legulegu.com',
      // 'Referer': 'https://legulegu.com/stockdata/hs300-pb',

    }
  }
).then(res=>{
  console.log(res);
  // console.log(res.data);
  fs.writeFileSync(path.resolve(__dirname, './pb.json'), JSON.stringify(res.data.data, '', 2));
}).catch(console.error);
