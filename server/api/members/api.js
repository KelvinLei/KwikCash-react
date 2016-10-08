import { authenticateUser } from './authenticate'
import { getLoans } from './loan-list'
import { getPayments } from './payments'
import { getUserDataAsync } from './get-user-data'
import { sendRefinanceEmail, sendPayoffEmail, sendReferalEmail } from './email-proxy'
import { emitCounterMetrics } from './metrics-proxy'
import _debug from 'debug'
import jwt from 'jsonwebtoken'
import config from '../../config'
import isEmail from 'validator/lib/isEmail';

const debug = _debug('app:server:api')

export function init(server) {
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
      var result = await sendRefinanceEmail({
        user: req.user,
        loanInput: {
          loanId: req.body.loanId,
          currentBalance: req.body.currentBalance,
          refinanceAmount: req.body.refinanceAmount,
        }
      });

      res.format({
        'application/json': () => {
          res.send(result);
        }
      });
    })();
  });

  server.post('/api/email/referal', (req, res) => {
    debug("invoking /api/email/referal");

    if (!req.body.referalEmail || !isEmail(req.body.referalEmail)) {
      res.status(400).send("invalid email address");
      return;
    }
    if (!req.body.referalName) {
      res.status(400).send("missing name");
      return;
    }
    (async () => {
      var result = await sendReferalEmail({
        user: req.user,
        referalEmail: req.body.referalEmail,
        referalName: req.body.referalName,
      });

      res.format({
        'application/json': () => {
          res.send(result);
        }
      });
    })();
  });

  server.post('/api/email/payoff', (req, res) => {
    debug("invoking /api/email/payoff");

    (async () => {
      var result = await sendPayoffEmail({
        user: req.user,
        loanId: req.body.loanId
      });

      res.format({
        'application/json': () => {
          res.send({'result': result});
        }
      });
    })();
  });

  server.post('/api/metrics/counter', (req, res) => {
    debug("invoking /api/metrics/counter");

    (async () => {
      var result = await emitCounterMetrics({
        user: req.user,
        metricsName: req.body.metricsName,
        // dimensions: req.body.dimensions
      });

      res.format({
        'application/json': () => {
          res.send({'result': result});
        }
      });
    })();
  });

  server.post('/api/log', (req, res) => {
    debug("invoking /api/log");

    const type = req.body.type || 'DEBUG'
    const output = `[${type}] ${req.body.message}`
    debug(output)
      res.format({
        'application/json': () => {
          res.send({'result': output});
        }
      });
  });
};


