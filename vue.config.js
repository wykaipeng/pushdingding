module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: {
      '/api': {
        target: 'https://oapi.dingtalk.com/robot/send?access_token=2f56ed23786060a28dd64cd4226ecd7b426b9b2de65ac5abdf45de192991a183',  //请求的服务器地址
        secure: true,    //如果是https,加入这句代码
        changeOrigin: true,     //同意跨域
        pathRewrite: { '^/api': '' },
      },
    }
  },
  publicPath: './'
}