
module.exports = (api, options, rootOptions) => {
  // 添加公共依赖
  api.extendPackage(pkg => {
    return {
      scripts: {
        "build:test": "vue-cli-service build --mode sit",
        "build:prod": "vue-cli-service build",
        "lint": "vue-cli-service lint",
        "lint:html": "eslint --ext .js,.vue src --format html --output-file ./lintReport.html"
      },
      dependencies: {
        "vue-router": "^3.0.3"
      },
      devDependencies: {
        "@babel/preset-env": "^7.8.3",
        "@vue/cli-plugin-babel": "^3.0.3",
        "@vue/cli-plugin-eslint": "^3.0.3",
        "@vue/eslint-config-standard": "^4.0.0",
        "babel-eslint": "^10.0.1",
        "compression-webpack-plugin": "^3.0.0",
        "eslint": "^5.16.0",
        "eslint-plugin-vue": "^5.0.0",
        "webpack-bundle-analyzer": "^3.3.2"
      }
    }
  })

  // 根据选择的模板类型添加不同的依赖，以及文件
  if (options.template === 'h5') {
    api.extendPackage(pkg => {
      return {
        devDependencies: {
          "less": "^3.10.3",
          "less-loader": "^5.0.0",
          "postcss-px2rem": "^0.3.0"
        }
      }
    })
    api.render('./template/h5')
  } else if (options.template === 'pc') {
    api.extendPackage(pkg => {
      return {
        devDependencies: {
          "node-sass": "^4.12.0",
          "sass-loader": "^8.0.0"
        }
      }
    })
    api.render('./template/pc')
  }

  // 添加请求加密相关的依赖及文件
  if (options.enableEncrypt) {
    api.extendPackage(pkg => {
      return {
        dependencies: {
          "@youngbeen/angle-util": "^1.3.9",
          "axios": "^0.19.0",
          "crypto-js": "^3.1.9-1",
          "js-base64": "^2.5.1"
        }
      }
    })
    api.render('./template/encrypt')
  }
}