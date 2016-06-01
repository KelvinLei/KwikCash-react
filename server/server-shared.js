var webpack = require('webpack');

var path = require('path');
var express = require('express');
var app = express();

const BUILD_DIR = path.join(__dirname, '..', 'build');

app.set('port', (process.env.PORT || 3000));

app.use(express.static(BUILD_DIR));

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'src', 'index.html'))
});

module.exports = app;
