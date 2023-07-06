let axios = require('axios');
let fs = require('fs');
let path = require('path');
axios.get(
  'https://legulegu.com/api/stockdata/index-basic?indexCode=000300.SH&token=b3aa6e42653aaa7a99da9008ce085064',
  {
    headers:{
      'Cookie': '__bid_n=184cb800a8b1d02dcc4207; FPTOKEN=o1vzEh9f24ktpJWqxeBqFpVyEaOTqr68NNHqIiCVhxSpcPsjPVk3OyoeAeYa8l8lGOi04yTcm0iBDLUWyhxgJccJmhzuYHQiuXfNtkNL0aCQ4NLFGgnQdVX0mCKurNw2kG8/ih1UKl33iftOoHebiQZsosZrlHfXsNkZXe86DguExUTJSlzVZTKeM6TxTl5oARyh7+Mxv1eR10ixuQ/jG5eJRdUX2lYVZgh312Ljr2iYOSgduJwJWPJHjsTjoWatK8fc/i3PNcFJhfrO3jXeBMYdHi2bh4dAidHjaScv7uGHx4IB4o3JYP/QcBqFaAXMScjMOPoL1/oomRzRYmm07N4LQk3A0/xbNBgqM0emeuG9B4QBu2KUJcsoemMkPlXJoREMeGI37MoWK8OBmC8P3w==|bmwwCCYotLHGJyhrWTkvnSJyKizJ26kgVCTpBc2StY8=|10|01716d909481b46867ea8c7d7f91af41; __bid_n=184cb800a8b1d02dcc4207; FPTOKEN=CwgzQKJlvPSG5aM70ut4bmoxQvN8oRdIUbsjVf3tWeYcIbQxEYM8x9gS7awHRrsEQAt4JfvC+Uvkwj0GvnmGnHFuM79om0weT8zEF9eKdKfIrJ9MLBhT/l20tgp550jZOG7Dfyw4Hk1U2JJz/ozDMObOhj/v/FwxVHWzl+zlEWq6rEMHCkPznPv/LBqzuneF0u+UGKHrgyO0lQc0vgUIopG6+DkwNxyjrUzY7Z8eo9L+CRYaWSIcYj0bFL9KFAY7+9rsqk1vjVJ3iMx/KwFbOyoNis/wEqOQ48nJSyCz8m6OVmLQLdcm6x3VyAUyMu5EBG0WYXVmhYV2C/O/pw9OLXxP348OejJVxyJPwW9k3NMiuJxIAHiBFCaZ+H73auDKPzbzYBIT85gIUF7HQN4zfA==|6hV6nll/onKw1Jij/eJ59tdc3FmG53HVDevwepC4Cf4=|10|4330b6203dc21461451dafc2bd851d2d; E691F8=e3a006be-5539-4fd9-8c06-4490dac02004; JSESSIONID=6C3777A97CF12B4C58B411B98E9DF73D; Hm_lvt_4064402dbf370b44e70272f9f2632a67=1687249246; _gid=GA1.2.1724615930.1687249247; Hm_lpvt_4064402dbf370b44e70272f9f2632a67=1687249651; _ga=GA1.2.1851491434.1669861478; _gat_gtag_UA_117119777_1=1; __gads=ID=ebde098664650560-22bb0b04c2e100f0:T=1687249247:RT=1687249651:S=ALNI_MZ0Pv9RslPriF3PIVjN1yAwMUe0bg; __gpi=UID=0000057b85a824fa:T=1687249247:RT=1687249651:S=ALNI_MaOFRCQBx5tdRtng9FD_vrJ1NAF6Q; _ga_5YD2TJWE1T=GS1.1.1687249246.1.1.1687249683.0.0.0',
      Referer: 'https://legulegu.com/stockdata/index-basic?indexCode=000300.SH',
      'Origin': 'legulegu.com',

    }
  }
).then(res=>{
  console.log(res.data);
  fs.writeFileSync(path.resolve(__dirname, './300ob.json'), JSON.stringify(res.data, '', 2));
});
