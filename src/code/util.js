/**
 * Created by lin on 2017/7/28.
 */
import { Message } from 'element-ui';
/**
 * axios中JSON提交的config配置
 * @type {{headers: {Content-Type: string}}}
 */
export const JSONHeader = {
  headers:{
    'Content-Type':'application/json'
  }
};
/**
 * axios中multipart/form-data提交的config配置
 * @type {{headers: {Content-Type: string}}}
 */
export const fileHeader = {
  headers:{
    'Content-Type':'multipart/form-data'
  }
};
/**
 * axios中multipart/form-data提交的config配置
 * @type {{headers: {Content-Type: string}}}
 */
export const formHeader = {
  headers:{
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};

export const util = {
  /**
   * 验证返回值 200 正常
   * 用于正常情况下的  data数据不为空   对data做验证
    */
  verifyResponse(data, isAlert) {
    if (data && data.data && data.data.code) {
      if (data.data.code === 200) {
        return data.data.result || null;
      } else {
        if(isAlert){
          Message.error(data.data.message);
        }
        return false;
      }
    } else {
      return false;
    }
  },
  /**
   * 验证返回值 200 正常
   * 用于正常情况下的  data数据不为空   对data做验证
    */
  verifyDataResponse(data, isAlert) {
    if (data && data.data && data.data.code) {
      if (data.data.code === 200) {
        return true;
      } else {
        if(isAlert){
          Message.error(data.data.message);
        }
      }
    } else {
      return false;
    }
  },
  validate(form){
    return new Promise((resolve, reject)=>{
      form.validate((valid)=>{
        if(valid){
          resolve(true);
        }else{
          resolve(false);
        }
      });
    });
  },
  /**
   * 处理异常  登录过期  跳转登录页
   * @returns {boolean}
   * @param error
   */
  handleResponseError(error) {
    Message.error(error.message);
    return false;
  },
};
export const systemUtil = util;
