import { authenticateUser } from './api/authenticate'
import { getLoans } from './api/loan-list'
import _debug from 'debug'
import jwt from 'jsonwebtoken'
import config from './config'

const debug = _debug('app:server:api')

export function init(server) {
  // todo: change to POST once ready for frontend integration
  server.post('/api/authenticate', (req, res) => {
    debug("calling authenticate");

    (async () => {
      debug(JSON.stringify(req.body));
      debug(`${req.body.username} ${req.body.password}`);
      let user;
      try {
        user = await authenticateUser(req.body.username, req.body.password);
      } catch(e) {
        res.status(401).send("wrong user or password");
      }
      debug("user: " + JSON.stringify(user));

      if (!user || !user.isValidPassword) {
        res.status(401).send("wrong user or password");
      }
      const token = jwt.sign(user, config.jwt_secret, { expiresIn: "2hr" });
      debug("token: " + JSON.stringify(token));
      res.format({
        'application/json': () => {
          res.send({ token });
        }
      });
    })()
  });

  // no input/service call needed here. user is deduced from the jwt token stored in local storage
  server.post('/api/user', (req, res) => {
    debug("calling authenticate/validate");

    res.format({
      'application/json': () => {
        res.send({ 'user': req.user });
      }
    });
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


