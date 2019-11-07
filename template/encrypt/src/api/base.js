import axios from 'axios'
// import base64 from 'crypto-js/enc-base64'
import sha256 from 'crypto-js/sha256'
import { dateUtil } from '@youngbeen/angle-util'
import system from '@/models/system'
import encryptUtil from '@/utils/encryptUtil'
// 全局参数，自定义参数可在发送请求时设置
axios.defaults.timeout = 30000 // 超时时间ms
axios.defaults.withCredentials = true
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
// const testServerDomain = 'https://mobl-test.chinaums.com' // 测试环境
const testServerDomain = 'http://localhost:8001' // 请求域 测试环境
const baseUrl = '/baseurl_TODO/' // 请求base url

// 请求时的拦截
// 回调里面不能获取错误信息
axios.interceptors.request.use(
  function (config) {
    // 发送请求之前做一些处理
    // console.log('请求url：' + config.url)
    config.data.appSource = '10003'
    config.data.msgSrc = 'H5'
    config.data.msgType = config.data.msgType || 'beginPayment'
    let data = config.data || {}
    let signFactor = ''
    let encryptedParamsStr = ''
    if (config.url.indexOf('/front/beginPayment') > -1) {
      // 接口使用固定的公私钥
      signFactor = system.fixedSignFactor
      encryptedParamsStr = encryptUtil.getEncodeStr(JSON.stringify(data), system.fixedPublicKey)
    } else {
      // 其他接口统一采用后台返回的公私钥
      console.log('使用业务公钥')
      signFactor = system.signFactor
      encryptedParamsStr = encryptUtil.getEncodeStr(JSON.stringify(data))
    }
    config.data = {
      params: encryptedParamsStr
    }
    let randoms = Math.floor(Math.random() * 10e13)
    let timestamp = new Date()
    timestamp = dateUtil.getDateTime(timestamp)
    // 计算签名
    let dataStr = JSON.stringify(config.data)
    // console.log('加密前', `${dataStr}|${signFactor}`)
    let sign = sha256(`${dataStr}|${signFactor}|${randoms}`).toString()
    // console.log('加密后', sign)
    if (system.token) {
      config.headers['tokenId'] = system.token
    }
    config.headers['sign'] = sign
    config.headers['signFactor'] = signFactor
    config.headers['nonce'] = randoms
    config.headers['reqTimestamp'] = timestamp
    return config
  },
  function (error) {
    // 当请求异常时做一些处理
    console.warn('请求异常：' + JSON.stringify(error))
    return Promise.reject(error)
    // return Promise.reject('请求异常，请稍后再试');
  }
)

axios.interceptors.response.use(function (response) {
  // Do something with response data
  // console.log('响应：' + JSON.stringify(response))
  let data = response.data
  if (data.respCode && data.respCode === system.authFailCode) {
    // TODO 重新授权
    // window.sessionStorage.removeItem('openId')
    // window.sessionStorage.removeItem('sdkConfig')
    // let url = window.location.href
    // url = url.split('#')[0]
    // window.location = `${url}#/redirect`
    // return false
  } else if (data.jsonData) {
    if (response.config.url.indexOf('/front/beginPayment') > -1) {
      // 接口使用固定的公私钥
      response.data.data = encryptUtil.getDecodeData(response.data.jsonData, system.fixedPrivateKey)
    } else {
      // 其他接口统一采用后台返回的公私钥
      console.log('使用业务私钥')
      response.data.data = encryptUtil.getDecodeData(response.data.jsonData)
    }
    if (response.data.data) {
      response.data.data = JSON.parse(response.data.data)
    }
    // console.log('解析数据', response.data.data)
    response.data = Object.assign({}, response.data, response.data.data)
  }
  return response
}, function (error) {
  // Do something with response error
  console.warn('响应出错：', error)
  return Promise.reject(error)
})

const base = {
  url: process.env.NODE_ENV === 'development' ? `${testServerDomain}${baseUrl}` : baseUrl,
  axios,
  testServerDomain: process.env.NODE_ENV === 'development' ? testServerDomain : ''
}
export default base
