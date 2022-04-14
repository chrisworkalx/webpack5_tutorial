const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new ModuleFederationPlugin({
      runtime: false,
      name: 'multiFee',
      filename: 'remoteEntry.js',
      remotes: {
        // 引入第三方的应用可以在本地项目使用 这里面的header是第三方定义的name值
        nav: 'dashboard@http://localhost:3000/remoteEntry.js',
      },
      exposes: {},
    }),
  ],
};
