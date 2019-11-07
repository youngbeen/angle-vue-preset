// import base64 from 'crypto-js/enc-base64'
import { Base64 } from 'js-base64'
// import sm2Crypto from 'sm-crypto'
import sha256 from 'crypto-js/sha256'
import CryptoJS from 'crypto-js'
// import RSA from './wechat_rsa'
// require('./jsencrypt.min.js')
// import JSEncrypt from './jsencrypt.min.js'
import system from '../models/system'

// const sm2 = sm2Crypto.sm2
// const cipherMode = 0 // 1 - C1C3C2，0 - C1C2C3，默认为1

export default {
  test () {
    // Encrypt
    var ciphertext = this.getEncodeStr('my message', system.fixedPublicKey)

    console.log(ciphertext)

    // Decrypt
    var originalText = this.getDecodeData(ciphertext, system.fixedPublicKey)

    console.log('解密结果', originalText) // 'my message'
  },
  // 通过业务参数得到加密后的字符串
  getEncodeStr (paramsStr = '', pk = '') {
    if (paramsStr) {
      // NOTE 如传入pk值，则使用传入值，否则使用后台返回的，最后降级使用固定值
      pk = pk || system.backendPublicKey || system.fixedPublicKey
      // pk = `-----BEGIN PUBLIC KEY-----${pk}-----END PUBLIC KEY-----`
      console.log('使用公钥' + pk)
      console.log('原始参数', paramsStr)
      console.log(Base64.encode(paramsStr))
      var keyHex = CryptoJS.enc.Utf8.parse(pk)
      var ciphertext = CryptoJS.TripleDES.encrypt(Base64.encode(paramsStr), keyHex, {
        // iv: CryptoJS.enc.Utf8.parse('01234567'),
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      }).toString()
      console.log(`加密${paramsStr}：`, ciphertext)
      return ciphertext
    } else {
      return ''
    }
  },
  // 通过字符串得到解密后的内容
  getDecodeData (str = '', pk = '') {
    if (str) {
      // NOTE 如传入pk值，则使用传入值，否则使用后台返回的，最后降级使用固定值
      pk = pk || system.backendPrivateKey || system.fixedPrivateKey
      // pk = `-----BEGIN PRIVATE KEY-----${pk}-----END PRIVATE KEY-----`
      console.log('使用私钥' + pk)
      var keyHex = CryptoJS.enc.Utf8.parse(pk)
      var bytes = CryptoJS.TripleDES.decrypt(str, keyHex, {
        // iv: CryptoJS.enc.Utf8.parse('01234567'),
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      })
      var originalText = bytes.toString(CryptoJS.enc.Utf8)
      originalText = Base64.decode(originalText)
      console.log('解密：', originalText)
      return originalText
    } else {
      return null
    }
  },
  // 通过参数生成签名
  getSign (params = {}) {
    // console.log('原始参数', params)
    let keys = Object.keys(params).sort() // 获得排序后的所有key值数组
    let pairs = keys.map(item => {
      // NOTE js的坑，null, {}, [] 都是object，我们只需要提出复杂的结构{}, []，所以做特殊处理剔除null的情况
      let pair = ''
      if (item && typeof params[item] === 'object') {
        // 复杂结构对象或者数组
        pair = `${item}=${JSON.stringify(params[item])}`
      } else {
        // 其他正常值
        pair = `${item}=${params[item]}`
      }
      return pair
    })
    // console.log('键值对', pairs)
    // 使用 & 拼接所有按key值排序过后的参数值对
    let rawString = pairs.join('&')
    console.log('待转键值对字符串', rawString)
    let sign = sha256(rawString).toString()
    // let sign = CryptoJS.SHA256(rawString)
    console.log('签名', sign)
    return sign
  },
  // 通过参数生成签名用的字符串
  getSignString (params = {}) {
    // console.log('原始参数', params)
    let keys = Object.keys(params).sort() // 获得排序后的所有key值数组
    let pairs = keys.map(item => {
      // NOTE js的坑，null, {}, [] 都是object，我们只需要提出复杂的结构{}, []，所以做特殊处理剔除null的情况
      let pair = ''
      if (item && typeof params[item] === 'object') {
        // 复杂结构对象或者数组
        pair = `${item}=${JSON.stringify(params[item])}`
      } else {
        // 其他正常值
        if (params[item] !== '') {
          pair = `${item}=${params[item]}`
        }
      }
      return pair
    })
    pairs = pairs.filter(item => item)
    // console.log('键值对', pairs)
    // 使用 & 拼接所有按key值排序过后的参数值对
    let rawString = pairs.join('&')
    console.log('待转键值对字符串', rawString)
    return rawString
  },
  // 指定规则加密pin内容
  encodePin (pin = '') {
    if (pin) {
      let privateString = sha256(pin).toString()
      return privateString
    } else {
      return ''
    }
  }
}
