import { validateUser } from './api/authenticate'
import { getLoans } from './api/loan-list'
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

  server.get('/api/loanlist', (req, res) => {
    debug("getting loanlist");

    co(function* () {
      return yield getLoans(req.query.username);
    }).then((loans) => {
      debug("loans: " + JSON.stringify(loans));
      res.format({
        'application/json': () => {
          res.send({
            loans: loans
          });
        }
      });
    });
  });
};


