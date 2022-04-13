const { resolve } = require('path');
module.exports = {
    mode: 'development',
    output: {
		filename: 'js/[name].js',
    },
    devtool: 'inline-source-map',
    devServer: {
      hot: true, //开启模块热重载
      static: resolve(__dirname, '../dist'), //默认把/dist目录当作当作web的根目录
      client: false,
      historyApiFallback: true //单页面应用 路由是history模式的时候，路由匹配不到默认到首页
    },
  }
