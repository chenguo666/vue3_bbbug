module.exports = {
  devServer: {
    https: false,
    hotOnly: false,
    proxy: {
      '/api': {
        target: 'http://music_api.guopro.cn/',
        changeOrigin: true
        // pathRewrite: {
        //   '^/api': ''
        // }
      }
    }
  },
  css: {
    loaderOptions: {
      sass: {
        // 8版本用prependData:
        prependData: `
          @import "@/styles/variables.scss";  // scss文件地址
          @import "@/styles/mixin.scss";     // scss文件地址
        `
      }
    }
  }
}
