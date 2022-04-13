const {
	resolve
} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //抽离css
const json5 = require('json5');
module.exports = {
	entry: {
		main: resolve(__dirname, '../src/index.js'),
		another: resolve(__dirname, '../src/another-module.js')
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
						presets: ['@babel/preset-env'],
						plugins: [
							['@babel/plugin-transform-runtime']
						]
					}
				},
				exclude: /node_modules/
			},
			{
				test: /\.png$/,
				//自带的resource 资源模块会将原文件打包到指定的目录
				type: 'asset/resource',
				//会忽略output中assetModuleFilename 使用配置的filename
				generator: {
					filename: 'images/[contenthash][ext]'
				}
			},
			{
				test: /\.svg$/,
				//asset/inline 会将资源专为dataurl形式
				//不会打包到dist目录中
				type: 'asset/inline'
			},
			{
				test: /\.txt$/,
				//asset/source 会保存源文件
				type: 'asset/source'
			},
			{
				//加载iconfont等字体
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				type: 'asset/resource'
			},
			{
				test: /\.jp(e)g$/,
				type: 'asset',
				parser: {
					dataUrlCondition: {
						maxSize: 4 * 1024
					}
				}
			},
			{
				test: /\.(css|less)$/,
				// use: ['style-loader', 'css-loader','less-loader']
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
			},
			{
				//加载csv或者tsv文件
				test: /\.(csv|tsv)$/,
				use: 'csv-loader'
			},
			{
				//加载xml
				test: /\.xml$/,
				use: 'xml-loader'
			},
			{
				//加载xml
				test: /\.json5$/,
				type: 'json',
				parser: {
					parse: json5.parse
				}
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: resolve(__dirname, '../public/index.html'),
			filename: 'index.html',
			title: 'hello chrisworkalx',
			favicon: resolve(__dirname, '../public/favicon.ico'),
			inject: 'body',
			minify: {
				//移除注释
				removeComments: true,
				//删除空格与换行符
				collapseWhitespace: true
			}
		}),
		new MiniCssExtractPlugin({
			//在单独的css文件中保存css文件
			filename: 'css/[name][contenthash].css'
		})
	],
	optimization: {
		splitChunks: {
			cacheGroups: {
				//缓存组 可以在浏览器中不会一直被重复请求，保证浏览器命中缓存
				vendor: {
					//将node_modules文件夹中的都缓存在浏览器端
					test: /[\\/]node_modules[\\/]/,
					name: 'vendor',
					chunks: 'all'
				}
			}
		}
	}
}
