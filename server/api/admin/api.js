import _debug from 'debug'
import jwt from 'jsonwebtoken'
import config from '../../config'
import { authenticateUser } from './authenticate'
import { filterLoans } from './filterLoans'
import { getRepeatCustomers } from './exportRepeats'
import { getExportLoanClientsWithGrossIncome } from './database-proxy'
import { fetchMembers } from './fetchMembers'
import { getLoans } from '../members/loan-list'
import json2xls from 'json2xls'
import {fetchLoanSummary} from "./fetchLoanSummary";
import {fetchPayoff} from "./fetchPayoff";
import {payoffAuthorization} from "./payoffAuthorization";
import {fetchMemberProfile} from "./fetchMemberProfile";
import {editLoan} from "./editLoanExecutor";

const debug = _debug('app:server:admin:api')

export function init(server) {
  server.post('/api/admin/authenticate', (req, res) => {
    debug("calling admin authenticate");

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

      const token = jwt.sign(user, config.admin_jwt_secret, { expiresIn: "2hr" });
      debug("token: " + JSON.stringify(token));
      res.format({
        'application/json': () => {
          res.send({ token });
        }
      });
    })()
  });

  // no input/service call needed here. user is deduced from the jwt token stored in local storage
  server.post('/api/admin/user', (req, res) => {
    debug("calling api/user");

    res.format({
      'application/json': () => {
        res.send({ 'user': req.user });
      }
    });
  });

  server.post('/api/admin/filterLoans', (req, res) => {
    debug("calling admin filter loans");

    (async () => {
      try {
        debug("filtering loans for " + JSON.stringify(req.body.filterContext));
        var loans = await filterLoans(req.body.filterContext);
        //debug("loans: " + JSON.stringify(loans));
        res.format({
          'application/json': () => {
            res.send({
              loans: loans
            });
          }
        });
      } catch (err) {
        debug(`filterLoans error ${err}`);
      }
    })();
  });

  server.post('/api/admin/exportLoans', (req, res) => {
    debug("calling admin export loans");

    (async () => {

      debug("filtering loans for " + JSON.stringify(req.body.filterContext));
      var loans = await filterLoans(req.body.filterContext);
      res.xls('loans.xlsx', loans);
    })();
  });

  server.post('/api/admin/exportRepeats', (req, res) => {
    debug("calling admin export repeats");

    (async () => {
      var repeats = await getRepeatCustomers();
      res.xls('repeats.xlsx', repeats);
    })();
  });
  
  server.post('/api/admin/exportClientsWithGrossIncome', (req, res) => {
    debug("calling exportClientsWithGrossIncome");

    (async () => {
      var clients = await getExportLoanClientsWithGrossIncome();
      res.xls('clientsWithGrossIncome.xlsx', clients);
    })();
  });
  

  server.post('/api/admin/fetchMembers', (req, res) => {
    (async () => {
      var members = await fetchMembers(req.body.memberName);

      res.format({
        'application/json': () => {
          res.send({
            members
          });
        }
      });
    })();
  });

  server.post('/api/admin/fetchMemberLoans', (req, res) => {
    (async () => {
      var memberLoans = await getLoans(req.body.memberId);
      res.format({
        'application/json': () => {
          res.send({
            memberLoans
          });
        }
      });
    })();
  });

  server.post('/api/admin/fetchLoanSummary', (req, res) => {
    (async () => {
      var loanSummary = await fetchLoanSummary(req.body.loanId);

      res.format({
        'application/json': () => {
          res.send({
            loanSummary
          });
        }
      });
    })();
  });

  server.post('/api/admin/fetchPayoff', (req, res) => {
    (async () => {
      var payoff = await fetchPayoff(req.body.loanId);

      res.format({
        'application/json': () => {
          res.send({
            payoff
          });
        }
      });
    })();
  });

  server.post('/api/admin/payoffAuthorization', (req, res) => {
    (async () => {
      debug('hitting payoffAuthorization')
      const doc = await payoffAuthorization(req.body.loanId);

      res.set ({
        "Content-Type": "application/vnd.ms-word",
        'Content-disposition': `attachment; filename=payoff_authorization_${req.body.loanId}.doc`
      });
      res.send(doc)
    })();
  });

  server.post('/api/admin/fetchMemberProfile', (req, res) => {
    (async () => {
      debug('hitting fetchMemberProfile')
      const memberProfile = await fetchMemberProfile(req.body.memberId);

      res.format({
        'application/json': () => {
          res.send({
            memberProfile
          });
        }
      });
    })();
  });

  server.post('/api/admin/editLoan', (req, res) => {
    (async () => {
      debug('hitting editLoan')
      try {
        const results = await editLoan(req.body.editLoanContext);

        res.format({
          'application/json': () => {
            res.send({
              results
            });
          }
        });
      }
      catch (err) {
        debug(`editLoan error. ${err}`)
      }
    })();
  });

};


