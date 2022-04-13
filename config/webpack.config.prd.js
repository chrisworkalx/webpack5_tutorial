const CssMiniMizerWebpackPlugin = require('css-minimizer-webpack-plugin'); //压缩css
const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
    mode: 'production',
    output: {
      filename: 'js/[name][contenthash].js',
      publicPath: '../' //这个主要是针对线上环境进行单独配置根路径
    },
    optimization: {
      minimizer: [
        new CssMiniMizerWebpackPlugin(), //注意此插件生效的话必须将mode改为production
		new TerserPlugin() //只有在生产环境中才开启压缩代码
      ]
    }
  }
