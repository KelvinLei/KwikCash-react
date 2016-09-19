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

      const token = jwt.sign(user, config.jwt_secret, { expiresIn: "2hr" });
      debug("token: " + JSON.stringify(token));
      res.format({
        'application/json': () => {
          res.send({ token });
        }
      });
    })()
  });

  server.post('/api/admin/filterLoans', (req, res) => {
    debug("calling admin filter loans");

    (async () => {

      debug("filtering loans for " + req.user);
      var loans = await filterLoans();
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


