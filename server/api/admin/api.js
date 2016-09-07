import _debug from 'debug'
import jwt from 'jsonwebtoken'
import config from '../../config'

const debug = _debug('app:server:admin:api')

export function init(server) {
  server.post('/api/admin/authenticate', (req, res) => {
    debug("calling authenticate");
  });
};


