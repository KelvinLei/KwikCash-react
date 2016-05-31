var webpack = require('webpack');
var config = require('../config/config');

var path = require('path');
var express = require('express');
var app = express();

const BUILD_DIR = path.join(__dirname, '..', 'build');

app.set('port', (process.env.PORT || 3000));

app.use(express.static(BUILD_DIR));

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'src', 'index.html'))
});

// ------------------------------------
// Apply Webpack HMR Middleware
// ------------------------------------
if (process.env.NODE_ENV !== 'production') {
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
}

app.listen(app.get('port'), function() {
  console.log('Server started: http://' + config.host + ':' + app.get('port') + '/');
});

