const {
  resolve,
} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const json5 = require('json5');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin'); // 创建service-worker实现离线浏览网页
const { ModuleFederationPlugin } = require('webpack').container;
// const deps = require('../package.json').dependencies;

module.exports = {
  entry: {
    main: resolve(__dirname, '../src/index.js'),
    another: resolve(__dirname, '../src/another-module.js'),
  },
  output: {
    path: resolve(__dirname, '../dist'),
    clean: true,
    assetModuleFilename: 'images/[name][contenthash][ext]',
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            // 更好的处理@babel/polyfill 可以针对性的对低版本浏览器进行优雅降级
            [
              '@babel/preset-env',
              {
                targets: [
                  'last 1 version',
                  '> 1%',
                ],
                useBuiltIns: 'usage',
                corejs: 3,
              },
            ],
          ],
          plugins: [
            ['@babel/plugin-transform-runtime'],
          ],
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
      type: 'asset',
      parser: {
        dataUrlCondition: {
          maxSize: 4 * 1024,
        },
      },
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
      template: resolve(__dirname, '../public/index.html'),
      filename: 'index.html',
      title: 'hello chrisworkalx',
      favicon: resolve(__dirname, '../public/favicon.ico'),
      inject: 'body',
      minify: {
        // 移除注释
        removeComments: true,
        // 删除空格与换行符
        collapseWhitespace: true,
      },
    }),
    new WorkboxWebpackPlugin.GenerateSW({
      clientsClaim: true, // 快速启动service-works
      skipWaiting: true, // 不允许遗留旧的service-works
    }),
    new ModuleFederationPlugin({
      runtime: false,
      name: 'dashboard', // 其他库需要链接的名字如   header@http://localhost:8080/remoteEntry.js
      filename: 'remoteEntry.js', // 其他应用引入的js文件
      remotes: {}, // 需要链接其他模块联邦导出的共享组件或应用
      exposes: {
        './DashboardApp': resolve(__dirname, '../src/federationFun/header.js'),
      }, // 暴露给外界的本应用地址
      shared: {}, // 第三方需要共享的文件如lodash等 这样其他应用使用会单独打出一个包
    }), // 模块联邦导出共享组件或者方法给外界使用
  ],
  optimization: {
    runtimeChunk: 'single', // webpack5 配置dev环境热交换，热重载有效
    // splitChunks: false //对于开启模块联邦splitchunks需要关闭
    splitChunks: {
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
};
