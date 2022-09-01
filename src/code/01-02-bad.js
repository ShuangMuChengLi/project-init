import axios from 'axios';
function main(){
  axios.get('url1').then((res)=>{
    console.log(res);
    axios.get('url2').then((res)=>{
      console.log(res);
      axios.get('url3').then((res)=>{
        console.log(res);
        axios.get('url4').then((res)=>{
          console.log(res);
        }).catch((err)=>{
          console.error(err);
        });
      }).catch((err)=>{
        console.error(err);
      });
    }).catch((err)=>{
      console.error(err);
    });
  }).catch((err)=>{
    console.error(err);
  });
}
