var path = require('path');
var express = require('express');
var app = express();

const BUILD_DIR = path.join(__dirname, '..', 'build');

app.set('port', (process.env.PORT || 3000));

app.use(express.static(BUILD_DIR));

module.exports = app;
