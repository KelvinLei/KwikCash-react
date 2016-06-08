import { validateUser } from './api/authenticate'
import _debug from 'debug'

const debug = _debug('app:server:api')

export default (server) => {
  // todo: change to POST once ready for frontend integration
  server.get('/api/authenticate', (req, res) => {
    debug("calling authenticate");
    var isUserValidated = validateUser(req.query.username, req.query.password, (response) => {
      debug("is user validated?: " + JSON.stringify(response));
    })
  });
};


