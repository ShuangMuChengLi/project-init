let axios = require('axios');
let fs = require('fs');
let path = require('path');
let moment = require('moment');
let date = moment().valueOf();
axios.get(
  `https://stock.xueqiu.com/v5/stock/chart/kline.json?symbol=SH000300&begin=${date}&period=day&type=before&count=-6000&indicator=kline,pe,pb,ps,pcf,market_capital,agt,ggt,balance`,
  {
    headers:{
      'Cookie': `

        xq_a_token=d72ef72db2d5882f8f8e1c0d5a8bf9e62ff01541;

      `.replace(/\s/g, ''),
      'Referer': 'https://xueqiu.com/S/SH000300',
      'Origin': 'https://xueqiu.com',

    }
  }
).then(res=>{
  console.log(res.data);
  fs.writeFileSync(path.resolve(__dirname, './300.json'), JSON.stringify(res.data, '', 2));
});
