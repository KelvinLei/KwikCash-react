import passport from 'passport';
import PassportLocal from 'passport-local';
import request from 'request';
import _debug from 'debug'
import config from './config/'

const debug = _debug('app:login')

var LocalStrategy = PassportLocal.Strategy;

const port = config.server_port
const host = config.server_host

export function init(server) {
  passport.use(new LocalStrategy((username, password, done) => {
    debug('calling local strategy ' + username + ' ' + password);
    request(`http://${host}:${port}/api/authenticate?username=${username}&password=${password}`, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        var passwordData = JSON.parse(body)
        if (passwordData.isValidPassword) {
          debug('password is valid');
          return done(null, username);
        } else {
          debug('password is not valid');
          return done(null, false, { message: 'Incorrect password.' });
        }
      }
      return done(error);
    })
  }));

  passport.serializeUser(function(username, done) {
    debug(`serializeUser ${username}`)
    done(null, username);
  });

  passport.deserializeUser(function(username, done) {
    debug(`deserializeUser ${username}`)
    done(null, username);
  });

  server.get('/login',
    passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }),
  );
}

