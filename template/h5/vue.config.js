const px2rem = require('postcss-px2rem')
const CompressionPlugin = require('compression-webpack-plugin')

const px2remConfig = px2rem({
  remUnit: 75
})

let publicPath = '/'
if (process.env.NODE_ENV === 'production') {
  if (process.env.VUE_APP_TARGET_ENV === 'sit') {
    // 测试环境
    publicPath = '/qmfrural-view/TODO/'
  } else {
    // 生产环境
    publicPath = '/qmfrural-view/TODO/'
  }
}

module.exports = {
  publicPath, // 设置资源public path
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          px2remConfig
        ]
      }
    }
  },
  chainWebpack: (config) => {
    // 添加分析工具
    if (process.env.NODE_ENV === 'production') {
      if (process.env.npm_config_report) {
        config
          .plugin('webpack-bundle-analyzer')
          .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
          .end()
        config.plugins.delete('prefetch')
      }
    }
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置
      config.mode = 'production'
      // gz压缩
      return {
        plugins: [new CompressionPlugin({
          test: /\.js$|\.html$|\.css/, // 匹配文件名
          threshold: 10240, // 对超过10k的数据进行压缩
          deleteOriginalAssets: false // 是否删除原文件
        })]
      }
    }
  }
}
