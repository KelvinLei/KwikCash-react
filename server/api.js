import { validateUser } from './api/authenticate'
import { co } from 'co'
import _debug from 'debug'

const debug = _debug('app:server:api')

export default (server) => {
  // todo: change to POST once ready for frontend integration
  server.get('/api/authenticate', (req, res) => {
    debug("calling authenticate");


    co(function* () {
      return yield validateUser(req.query.username, req.query.password);
    }).then((response) => {
      debug("is user validated?: " + JSON.stringify(response));
      res.format({
        'application/json': () => {
          res.send({
            isAuthenticated: response.isValidPassword
          });
        }
      });
    });
  });
};


