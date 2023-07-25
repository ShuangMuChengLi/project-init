let axios = require('axios');
let fs = require('fs');
let path = require('path');
let moment = require('moment');
let date = moment().valueOf();
axios.get(
  `https://stock.xueqiu.com/v5/stock/chart/kline.json?symbol=SH000300&begin=${date}&period=day&type=before&count=-6000&indicator=kline,pe,pb,ps,pcf,market_capital,agt,ggt,balance`,
  {
    headers:{
      'Cookie': 'device_id=29cbeb61310509e0d0ea07c8be2ec0ed; s=dl12j264w1; bid=b437f86d2d00dca262c80e9b21a20674_lb03q43o; xq_is_login=1; u=4370149335; xq_a_token=d72ef72db2d5882f8f8e1c0d5a8bf9e62ff01541; xqat=d72ef72db2d5882f8f8e1c0d5a8bf9e62ff01541; xq_id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1aWQiOjQzNzAxNDkzMzUsImlzcyI6InVjIiwiZXhwIjoxNjkxODkxNDY4LCJjdG0iOjE2ODkyOTk0NjgyNzcsImNpZCI6ImQ5ZDBuNEFadXAifQ.Y9JUjz-26pwgnKorLIcgnZx-rK3ZG07PePUj_bxYooYLLjtGngnM5FB9RZFa4ZhRbJ9CPVcDapFP4b7bAoismUvEsATgssIySXjiwram7wx8o5S1GbRGyll2VyUFgt-mgjcNRQNKHC6_UpY1RkJFSIPS7TCt8bs9hM8Hg5FuTwpUUyr_6u0wyxlu8if2vdhV0C2e-LGD_pVU4b6tn5IVfnGG1OBjZEx28o9aBEvnHfn1tMw-n9PNG63fvLexpKgxgIYH2EaUGfnXLIdeSVhIGZszwFCLMk0KSBTy6v5EzflqMT9mV2lu7tbb_myOOgCoIJouiOQf3-wklK-onwcKuw; xq_r_token=36a0eee893e37308baf941b0d16743da835ad0c1; Hm_lvt_1db88642e346389874251b5a1eded6e3=1689656423,1689658739,1689660311,1689729921; is_overseas=0; Hm_lpvt_1db88642e346389874251b5a1eded6e3=1689730764',
      'Referer': 'https://xueqiu.com/S/SH000300',
      'Origin': 'https://xueqiu.com',

    }
  }
).then(res=>{
  console.log(res.data);
  fs.writeFileSync(path.resolve(__dirname, './300.json'), JSON.stringify(res.data, '', 2));
});
