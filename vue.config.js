module.exports = {
  filenameHashing: false,
  outputDir: 'dist-crx/dist',
  productionSourceMap: false,
  devServer: {
    port: 3009,
    proxy: {
      '/api/': {
        // target: 'http://192.168.0.16:9999/',
        // target: 'http://192.168.0.52:9999/', // 测试环境
        target: 'https://gitee.com/api/v5/', // 开发环境
        // target: 'http://47.115.6.210/api/', // 光正
        // target: 'http://120.77.150.245/api/', // 测试
        // target: 'http://120.79.209.48/api/', // 生产
        // target: 'http://121.12.148.118/api/', // 光正
        changeOrigin: true,
        pathRewrite: {
          '^/api/': '/'
        }
      }
    }
  },
  transpileDependencies: [
    'vuetify'
  ]
}
