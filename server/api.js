import { authenticateUser } from './api/authenticate'
import { getLoans } from './api/loan-list'
import { getPayments } from './api/payments'
import { getUserDataAsync } from './api/get-user-data'
import { sendRefinanceEmail } from './api/email-refinance'
import _debug from 'debug'
import jwt from 'jsonwebtoken'
import config from './config'

const debug = _debug('app:server:api')

export function init(server) {
  // todo: change to POST once ready for frontend integration
  server.post('/api/authenticate', (req, res) => {
    debug("calling authenticate");

    (async () => {
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
    debug("calling api/user");

    res.format({
      'application/json': () => {
        res.send({ 'user': req.user });
      }
    });
  });

  server.post('/api/userdata', (req, res) => {
    debug("getting userdata");

    (async () => {

      debug("getting userdata for " + req.user.id);
      const userData = await getUserDataAsync(req.user.id);
      const result = {
        ...userData,
        username: req.user.username
      }
      debug("userData: " + JSON.stringify(userData));
      res.format({
        'application/json': () => {
          res.send({
            userData: result
          });
        }
      });
    })();
  });

  server.post('/api/loanlist', (req, res) => {
    debug("getting loanlist");

    (async () => {

      debug("getting loanlist for " + req.user.id);
      var loans = await getLoans(req.user.id);
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

  server.post('/api/payments', (req, res) => {
    debug("invoking /api/payments");

    if (!req.body.loanId) {
      res.status(400).send("missing input loanId");
    }

    (async () => {
      var payments = await getPayments(req.body.loanId);
      debug("payments: " + JSON.stringify(payments));
      res.format({
        'application/json': () => {
          res.send(payments);
        }
      });
    })();
  });

  server.post('/api/email/refinance', (req, res) => {
    debug("invoking /api/email/refinance");

    (async () => {
      var result = await sendRefinanceEmail();
      debug("result: " + JSON.stringify(result));
      res.format({
        'application/json': () => {
          res.send(result);
        }
      });
    })();
  });
};


