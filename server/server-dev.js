var app = require('./server-shared');
var config = require('../config/config');
var webpack = require('webpack');
var path = require('path');

// ------------------------------------
// Apply Webpack HMR Middleware
// ------------------------------------
var webpackDevMiddleware = require("webpack-dev-middleware");
var webpackHotMiddleware = require("webpack-hot-middleware");
var webpackConfig = require('../webpack.config');
var compiler = webpack(webpackConfig);

var serverOptions = {
	contentBase: 'http://' + config.host + ':' + config.devServerPort,
	quiet: true,
	noInfo: true,
	hot: true,
	inline: true,
	historyApiFallback: true,
	lazy: false,
	headers: {'Access-Control-Allow-Origin': '*'},
	stats: {colors: true}
};

app.use(webpackDevMiddleware(compiler, serverOptions));
app.use(webpackHotMiddleware(compiler));

app.get('*', function (req, res) {
	res.sendFile(path.join(__dirname, '..', 'src', 'index.html'))
});

app.listen(app.get('port'), function() {
  console.log('Server started: http://' + config.host + ':' + app.get('port') + '/');
});

