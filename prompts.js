module.exports = [
  {
    type: 'list',
    name: 'template',
    message: '请选择模板',
    choices: [
      {
        name: 'H5',
        value: 'h5'
      },
      {
        name: 'PC',
        value: 'pc'
      }
    ],
    default: 'None'
  },
  {
    type: 'confirm',
    name: 'enableEncrypt',
    message: '是否需要请求加密模块',
    default: false
  }
]