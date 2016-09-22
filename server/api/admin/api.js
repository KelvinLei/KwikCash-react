import _debug from 'debug'
import jwt from 'jsonwebtoken'
import config from '../../config'
import { authenticateUser } from './authenticate'
import { filterLoans } from './filterLoans'


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

      debug("filtering loans for " + JSON.stringify(req.body.filterContext));
      var loans = await filterLoans(req.body.filterContext);
      // debug("loans: " + JSON.stringify(loans));
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


