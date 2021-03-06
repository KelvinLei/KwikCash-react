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
import {editLoan} from "./editLoan";
import {deletePaymentQuery, runParameterizedQuery} from "./database-proxy";
import {fetchSinglePayment} from "./fetchSinglePayment";
import {editPayment} from "./editPayment";
import {waivePayment} from "./waivePayment";
import {deletePayment} from "./deletePayment";
import {fetchLoanStats} from "./fetchLoanStats";
import {fetchARReport, exportARReport} from "./fetchARReport";

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

  server.post('/api/admin/exportARReport', (req, res) => {
    debug("calling exportARReport");

    (async () => {
      var loans = await exportARReport();

      res.xls('exportARReport.xlsx', loans);
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
      try {
        var loanSummary = await fetchLoanSummary(req.body.loanId);

        res.format({
          'application/json': () => {
            res.send({
              loanSummary
            });
          }
        });
      }
      catch (err) {
        debug(`fetchLoanSummary error. ${err}`)
      }
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

  server.post('/api/admin/deletePayment', (req, res) => {
    (async () => {
      debug(`hitting deletePayment payment id: ${req.body.paymentId}`)
      try {
        const results = await deletePayment(req.body.paymentId)
        res.format({
          'application/json': () => {
            res.send({
              results
            });
          }
        });
      }
      catch (err) {
        debug(`deletePayment error. ${err}`)
      }
    })();
  });

  server.post('/api/admin/waivePayment', (req, res) => {
    (async () => {
      debug('hitting waivePayment')
      try {
        const results = await waivePayment(req.body.waivePaymentContext)
        res.format({
          'application/json': () => {
            res.send({
              results
            });
          }
        });
      }
      catch (err) {
        debug(`waivePayment error. ${err}`)
      }
    })();
  });

  server.post('/api/admin/fetchSinglePayment', (req, res) => {
    (async () => {
      debug('hitting fetchSinglePayment')
      try {
        const payment = await fetchSinglePayment(req.body.paymentId);
        res.format({
          'application/json': () => {
            res.send({
              payment
            });
          }
        });
      }
      catch (err) {
        debug(`fetchSinglePayment error. ${err}`)
      }
    })();
  });

  server.post('/api/admin/editPayment', (req, res) => {
    (async () => {
      debug('hitting editPayment')
      try {
        const results = await editPayment(req.body.editPaymentContext);
        res.format({
          'application/json': () => {
            res.send({
              results
            });
          }
        });
      }
      catch (err) {
        debug(`editPayment error. ${err}`)
      }
    })();
  });

  server.post('/api/admin/fetchLoanStats', (req, res) => {
    (async () => {
      debug('hitting fetchLoanStats')
      try {
        const loanStats = await fetchLoanStats(req.body.dateRange);
        res.format({
          'application/json': () => {
            res.send({
              loanStats
            });
          }
        });
      }
      catch (err) {
        debug(`fetchLoanStats error. ${err}`)
      }
    })();
  });

  server.post('/api/admin/fetchARReport', (req, res) => {
    (async () => {
      debug('hitting fetchARReport')
      try {
        const arReport = await fetchARReport();
        res.format({
          'application/json': () => {
            res.send({
              arReport
            });
          }
        });
      }
      catch (err) {
        debug(`fetchARReport error. ${err}`)
      }
    })();
  });

};


