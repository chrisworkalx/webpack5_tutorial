const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 抽离css
const CssMiniMizerWebpackPlugin = require('css-minimizer-webpack-plugin'); // 压缩css
const json5 = require('json5');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer'); // 代码打包分析
const WorkboxWebpackPlugin = require('workbox-webpack-plugin'); // 创建service-worker实现离线浏览网页

module.exports = (env) => ({
  entry: {
    main: resolve(__dirname, './src/index.js'),
    another: resolve(__dirname, './src/another-module.js'),
  },
  mode: env.production ? 'production' : 'development',
  output: {
    path: resolve(__dirname, './dist'),
    filename: 'js/[name][contenthash].js',
    // 每次打包全部清楚dist文件夹中的所有内容
    clean: true,
    // assetModuleFilename 指定全局的资源打包地址路径 [ext]表示资源后缀名 如png/jpg/svg等
    assetModuleFilename: 'images/[name][contenthash][ext]',
    publicPath: './', // 这个主要是针对线上环境进行单独配置根路径
  },
  devtool: env.production ? false : 'inline-source-map',
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
            presets: [
              // 更好的处理@babel/polyfill 可以针对性的对低版本浏览器进行优雅降级
              [
                '@babel/preset-env',
                {
                  targets: ['last 1 version', '> 1%'],
                  useBuiltIns: 'usage',
                },
              ],
            ],
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
  resolve: {
    // 省略文件后缀
    extensions: ['.js', '.ts', '.jsx', '.vue'],
    // 路径重命名
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  externalsType: 'script',
  externals: {
    // 做cdn配置
    jquery: [
      'https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js',
      '$', // jquery对外导出的变量 有$还有jQuery
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
    new BundleAnalyzerPlugin(),
    // 实现浏览器pwa 缓存网页 在没有网络的情况下可以很好的使用缓存
    new WorkboxWebpackPlugin.GenerateSW({
      clientsClaim: true, // 快速启动service-works
      skipWaiting: true, // 不允许遗留旧的service-works
    }),
  ],
  optimization: {
    /**
     * tree shaking 在生产环境过滤掉没有使用的代码
     * 一般import{}from '库'会默认进行shaking
     * 而import '文件'会忽略shaking
     * 我们会在package.json中配置sideEffects进行过滤哪些是有副作用的文件
     * 如import './style.css' 如果设置sideEffects: true 则表示都有副作用 不会对treeshaking
     * 如果设置sideEffects: false则会shaking这些文件
     * 如果设置sideEffects: ['*.css'] 则不会shaking
     */
    usedExports: true, // webpack5 默认treeshaking
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
