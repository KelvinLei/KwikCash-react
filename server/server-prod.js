var app = require('./server-shared');
var config = require('../config/config');

app.listen(app.get('port'), function() {
  console.log('Server started: http://' + config.host + ':' + app.get('port') + '/');
});

