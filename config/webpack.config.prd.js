const CssMiniMizerWebpackPlugin = require('css-minimizer-webpack-plugin'); // 压缩css
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer'); // 代码打包分析

module.exports = {
  mode: 'production',
  output: {
    filename: 'js/[name][contenthash].js',
    publicPath: '../', // 这个主要是针对线上环境进行单独配置根路径
  },
  //* .global.css的文件不开启css模块化
  module: {
    rules: [
      {
        test: /\.(css|less)$/,
        use: [
          MiniCssExtractPlugin.loader,
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
  optimization: {
    minimizer: [
      new CssMiniMizerWebpackPlugin(), // 注意此插件生效的话必须将mode改为production
      new TerserPlugin(), // 只有在生产环境中才开启压缩代码
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name][contenthash].css',
    }),
    new BundleAnalyzerPlugin(),
  ],
};
