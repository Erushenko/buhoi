const webpack = require('webpack')

module.exports = function (config) {
	return typeof config != 'string'
		? create(config)
		: create({
			entry: `${config}/client.js`,
			output: {
				path: `${config}/static`,
				filename: 'bundle.js',
			},
		})
}

function create ({ entry, output }) {
	return {
		entry,
		output,
		resolve: { extensions: ['.js', '.jsx'] },
		module: {
			rules: [
				{
					test: /\.jsx?$/,
					exclude: /(node_modules)|(buhoi-client)|(buhoi-ui)/,
					use: {
						loader: 'babel-loader',
						options: {
							plugins: ['syntax-jsx', 'inferno'],
							presets: ['stage-0', 'es2015'],
						},
					},
				},
				{
					test: /\.js$/,
					include: /buhoi/,
					use: 'buhoi/source-map-loader',
					enforce: 'pre',
				},
				{
					test: /\.scss$/,
					use: ['style-loader', 'css-loader', 'sass-loader'],
				},
			],
		},
		plugins: [
			new webpack.ProvidePlugin({ 'Inferno': 'inferno' }),
			new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) }),
		],
		devtool: process.env.NODE_ENV == 'development' ? 'source-map' : undefined,
		devServer: {
			hot: true,
			inline: true,
			proxy: { '*': { target: 'http://localhost:3000' } },
		},
	}
}