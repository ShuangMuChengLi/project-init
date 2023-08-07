let axios = require('axios');
let fs = require('fs');
let path = require('path');
let moment = require('moment');
let date = moment().valueOf();
axios.get(
  `https://legulegu.com/api/stockdata/index-basic-pb?indexCode=000300.SH&token=2a5ba0918d8bdf23af464ee6a2e8a45e`,
  {
    headers:{
      'Cookie': `8A3165B4=e3ef9760-f7ee-45b9-93f4-a46b06271951;`.replace(/\s/g, ''),
      // 'Host': 'legulegu.com',
      // 'Referer': 'https://legulegu.com/stockdata/hs300-pb',

    }
  }
).then(res=>{
  console.log(res);
  // console.log(res.data);
  fs.writeFileSync(path.resolve(__dirname, './pb.json'), JSON.stringify(res.data.data, '', 2));
}).catch(console.error);
