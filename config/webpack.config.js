const {
	merge
} = require('webpack-merge');
const commonConfig = require('./webpack.config.base.js');
const devConfig = require('./webpack.config.dev.js');
const proConfig = require('./webpack.config.prd.js');


module.exports = (env) => {
	switch (true) {
		case env.development:
			return merge(commonConfig, devConfig);
		case env.production:
			return merge(commonConfig, proConfig);
		default:
			return new Error('No matching configuration was found');
	}
}
