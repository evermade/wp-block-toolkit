const defaultConfig = require("@wordpress/scripts/config/webpack.config");

module.exports = {
	...defaultConfig,
	output: {
		...defaultConfig.output,
		libraryTarget: "commonjs-module",
	},
};
