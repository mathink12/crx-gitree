module.exports = {
  outputDir: 'dist-crx/dist',
  filenameHashing: false, // 禁用文件 hash
  productionSourceMap: false, // 关闭 sourcemap
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
  ],
  pages: {
    index: {
      // page 的入口
      entry: 'src/main.js',
      // 模板来源
      template: 'public/index.html',
      // 在 dist/index.html 的输出
      filename: 'index.html'
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      // title: 'Index Page',
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      // chunks: ['chunk-vendors', 'app']
    },
    popup: {
      entry: 'src/popup/main.js',
      template: 'public/popup.html',
      filename: 'popup.html'
      // chunks: ['chunk-vendors', 'popup']
    }
  }
}
