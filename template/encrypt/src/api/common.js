import base from './base'
// import encryptUtil from '@/utils/encryptUtil'
let axios = base.axios
let baseUrl = base.url
// let baseUrl = base.testServerDomain

// export const getCaptcha = params => {
//   return axios({
//     method: 'get',
//     url: `${baseUrl}front/getGeeVerifyInfo`,
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
//     },
//     params
//   }).then(res => res.data)
// }
// export const auth = params => {
//   return axios({
//     method: 'post',
//     url: `${baseUrl}front/beginPayment`,
//     data: params || {}
//   }).then(res => res.data)
// }
