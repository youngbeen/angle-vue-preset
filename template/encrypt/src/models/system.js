export default {
  okCode: '0000', // 请求成功业务码
  authFailCode: '9999', // 登录失效业务码
  fixedPublicKey: '', // 固定加密用公钥 NOTE 只用于首次
  fixedPrivateKey: '', // 固定解密用私钥 NOTE 只用于首次
  fixedSignFactor: '', // 固定接口使用的固定signFactor
  // system using, do NOT change
  backendPublicKey: '', // 加密用公钥 后台返回 用于业务
  backendPrivateKey: '', // 解密用私钥 后台返回 用于业务
  signFactor: '' // 后台返回的signFactor，用于签名算法使用
}
