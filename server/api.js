import { validateUser } from './api/authenticate'
import { getLoans } from './api/loan-list'
import _debug from 'debug'

const debug = _debug('app:server:api')

export function init(server) {
  // todo: change to POST once ready for frontend integration
  server.get('/api/authenticate', (req, res) => {
    debug("calling authenticate");

    (async () => {
      var response = await validateUser(req.query.username, req.query.password);
      debug("is user validated?: " + JSON.stringify(response));
      res.format({
        'application/json': () => {
          res.send(response);
        }
      });
    })()
  });

  server.get('/api/loanlist', (req, res) => {
    debug("getting loanlist");

    (async () => {
      var loans = await getLoans(req.query.username);
      debug("loans: " + JSON.stringify(loans));
      res.format({
        'application/json': () => {
          res.send({
            loans: loans
          });
        }
      });
    })();
  });
};


