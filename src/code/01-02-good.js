import axios from 'axios';
import {systemUtil} from './util';
async function main(){
  let result1 = await axios.get('url1')
    .then(systemUtil.verifyResponse)
    .catch(systemUtil.handleResponseError);
  if(!result1)return;

  let result2 = await axios.get('url2')
    .then(systemUtil.verifyResponse)
    .catch(systemUtil.handleResponseError);
  if(!result2)return;

  let result3 = await axios.get('url3')
    .then(systemUtil.verifyResponse)
    .catch(systemUtil.handleResponseError);
  if(!result3)return;

  let result4 = await axios.get('url4')
    .then(systemUtil.verifyResponse)
    .catch(systemUtil.handleResponseError);
  if(!result4)return;

  let result5 = await axios.get('url5')
    .then(systemUtil.verifyResponse)
    .catch(systemUtil.handleResponseError);
  if(!result5)return;

  console.log('success', result1, result2, result3, result4, result5)
}
