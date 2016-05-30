var webpack = require('webpack');

var path = require('path');
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 3000));

app.use(express.static(path.join(__dirname, '..', 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'src', 'index.html'))
});

// ------------------------------------
// Apply Webpack HMR Middleware
// ------------------------------------
if (process.env.NODE_ENV !== 'production') {
    var webpackConfig = require('../webpack.config');
    var compiler = webpack(webpackConfig);

    var host = process.env.HOST || 'localhost';
    var port = (Number(process.env.PORT) + 1) || 3001;

    var serverOptions = {
        contentBase: 'http://' + host + ':' + port,
        quiet: true,
        noInfo: true,
        hot: true,
        inline: true,
        lazy: false,
        publicPath: webpackConfig.output.path,
        headers: {'Access-Control-Allow-Origin': '*'},
        stats: {colors: true}
    };

    app.use(require('webpack-dev-middleware')(compiler, serverOptions));
    app.use(require('webpack-hot-middleware')(compiler));
}

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});

