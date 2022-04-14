// webpack5默认开启hot: true 不需要手动设置
// const { HotModuleReplacementPlugin } = require('webpack');

const {
  resolve,
} = require('path');

module.exports = {
  // target: 'web',
  mode: 'development',
  output: {
    filename: 'js/[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(css|less)$/,
        use: ['style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                // auto: (resourcePath) => resourcePath.endsWith('.less'),  // 匹配.less文件来进行css模块化。
                auto: (resourcePath) => !resourcePath.includes('global'), // 匹配不包含global字符串的文件来进行css模块化。
                localIdentName: '[local]_[hash:base64:10]',
              },
            },
          },
          'less-loader',
          'postcss-loader',
        ],
      },
    ],
  },
  devtool: 'cheap-module-source-map',
  devServer: {
    hot: true, // 开启模块热替换 默认是开启的
    liveReload: true, // 默认都是开启的
    static: resolve(__dirname, '../dist'), // 默认把/dist目录当作当作web的根目录
    // client: false, //开启的话 hot会失效
    host: '0.0.0.0', // 其他电脑可以在局域网访问到我的ip地址
    historyApiFallback: true, // 单页面应用 路由是history模式的时候，路由匹配不到默认到首页
  },
  // plugins: [
  // new HotModuleReplacementPlugin()
  // ]
};
