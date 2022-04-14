const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 抽离css
const CssMiniMizerWebpackPlugin = require('css-minimizer-webpack-plugin'); // 压缩css
const json5 = require('json5');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env) => ({
  entry: {
    main: resolve(__dirname, './src/index.js'),
    another: resolve(__dirname, './src/another-module.js'),
  },
  mode: env.production ? 'production' : 'development',
  //   mode: 'production',
  output: {
    path: resolve(__dirname, './dist'),
    filename: 'js/[name][contenthash].js',
    // 每次打包全部清楚dist文件夹中的所有内容
    clean: true,
    // assetModuleFilename 指定全局的资源打包地址路径 [ext]表示资源后缀名 如png/jpg/svg等
    assetModuleFilename: 'images/[name][contenthash][ext]',
    publicPath: './', // 这个主要是针对线上环境进行单独配置根路径
  },
  devtool: 'inline-source-map',
  devServer: {
    port: 9527,
    hot: true, // 开启模块热重载
    // open: true,
    // compress:  默认true 开启浏览器gzip压缩
    // compress: false, //取消gzip
    static: resolve(__dirname, './dist'), // 默认把/dist目录当作当作web的根目录
    client: false,
    historyApiFallback: true, // 单页面应用 路由是history模式的时候，路由匹配不到默认到首页
    // https: {}
    // http2: true //开启devserver在https启动
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [['@babel/plugin-transform-runtime']],
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.png$/,
        // 自带的resource 资源模块会将原文件打包到指定的目录
        type: 'asset/resource',
        // 会忽略output中assetModuleFilename 使用配置的filename
        generator: {
          filename: 'images/[contenthash][ext]',
        },
      },
      {
        test: /\.svg$/,
        // asset/inline 会将资源专为dataurl形式
        // 不会打包到dist目录中
        type: 'asset/inline',
      },
      {
        test: /\.txt$/,
        // asset/source 会保存源文件
        type: 'asset/source',
      },
      {
        // 加载iconfont等字体
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
      },
      {
        test: /\.jp(e)g$/,
        // asset 通用资源模式 默认大于4kb就按路径打包到dist中，否则以dataurl形式转换
        type: 'asset',
        parser: {
          dataUrlCondition: {
            // 默认是4 * 1024 这里我们是测试
            // maxSize: 4 * 1024 * 1024
            maxSize: 4 * 1024,
          },
        },
      },
      {
        test: /\.(css|less)$/,
        // use: ['style-loader', 'css-loader','less-loader']
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
      },
      {
        // 加载csv或者tsv文件
        test: /\.(csv|tsv)$/,
        use: 'csv-loader',
      },
      {
        // 加载xml
        test: /\.xml$/,
        use: 'xml-loader',
      },
      {
        // 加载xml
        test: /\.json5$/,
        type: 'json',
        parser: {
          parse: json5.parse,
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(__dirname, './public/index.html'),
      filename: 'index.html',
      // title定义的自定义title
      title: 'hello chrisworkalx',
      // 传入favicon
      favicon: resolve(__dirname, './public/favicon.ico'),
      inject: 'body',
      minify: {
        // 移除注释
        removeComments: true,
        // 删除空格与换行符
        collapseWhitespace: true,
      },
    }),
    new MiniCssExtractPlugin({
      // 在单独的css文件中保存css文件
      filename: 'css/[name][contenthash].css',
    }),
  ],
  optimization: {
    minimizer: [
      new CssMiniMizerWebpackPlugin(), // 注意此插件生效的话必须将mode改为production
      new TerserPlugin(), // 只有在生产环境中才开启压缩代码
    ],
    splitChunks: {
      // chunks: 'all',
      cacheGroups: {
        // 缓存组 可以在浏览器中不会一直被重复请求，保证浏览器命中缓存
        vendor: {
          // 将node_modules文件夹中的都缓存在浏览器端
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },
});
