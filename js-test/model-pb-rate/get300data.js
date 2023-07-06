let axios = require('axios');
let fs = require('fs');
let path = require('path');
axios.get(
  'https://stock.xueqiu.com/v5/stock/chart/kline.json?symbol=SH000300&begin=1687052084252&period=day&type=before&count=-5000&indicator=kline,pe,pb,ps,pcf,market_capital,agt,ggt,balance',
  {
    headers:{
      'Cookie': 'device_id=29cbeb61310509e0d0ea07c8be2ec0ed; s=dl12j264w1; bid=b437f86d2d00dca262c80e9b21a20674_lb03q43o; xq_is_login=1; u=4370149335; xq_a_token=a1f105ea05717e43d34a501d7ffe40f66a1a8a80; xqat=a1f105ea05717e43d34a501d7ffe40f66a1a8a80; xq_id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1aWQiOjQzNzAxNDkzMzUsImlzcyI6InVjIiwiZXhwIjoxNjg5Mjk4NTAzLCJjdG0iOjE2ODY3MDY1MDM1MDYsImNpZCI6ImQ5ZDBuNEFadXAifQ.XoH0znX97sjntZrYmmK6vJBXSlphNH4ep3SUUKeieGDN1atAP0rCO2sSXlM6KHonj-lrSIb37q8w_YxArMsWjOKe-l3tBncaR1YDK3F1_7N0q-W9cQg4Pnl9Z6Ou4C0pkHnWwEaiNGS9L-WHMLgl7CFUN3vLfXHbryZtqgirc4mIN335Jpi98M7-rDTmT97n1lgFLVQLIsHoU13hxpEbb9UAEo6Nh80YO8cN3w2NX5lHp6WDnQl4nv-5LBFou9Z1vr8h3mc6HVKVquaKu97Hxv-a-hoKBHyTV1nxYRJWVL7jXXI95DEEbnvIDzUJgObIORYsm47_NAwAK7ValTQ_kA; xq_r_token=f1ac31d2522e68fbd2aaa4dda6d31bb4657d0b0c; is_overseas=0; Hm_lvt_1db88642e346389874251b5a1eded6e3=1686901136,1686903508,1686904664,1686965656; Hm_lpvt_1db88642e346389874251b5a1eded6e3=1686965676',
      'Referer': 'https://xueqiu.com/S/SH000300',
      'Origin': 'https://xueqiu.com',

    }
  }
).then(res=>{
  console.log(res.data);
  fs.writeFileSync(path.resolve(__dirname, './300.json'), JSON.stringify(res.data, '', 2));
});
