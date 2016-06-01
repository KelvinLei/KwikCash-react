var app = require('./server-shared');
var config = require('../config/config');

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '..', 'src', 'index.html'))
});

app.listen(app.get('port'), function() {
  console.log('Server started: http://' + config.host + ':' + app.get('port') + '/');
});

