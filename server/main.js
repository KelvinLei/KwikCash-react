import Express from 'express'
import webpack from 'webpack'
import webpackConfig from '../webpack/webpack.config'
import _debug from 'debug'
import config from './config/'
import webpackDevMiddleware from './middleware/webpack-dev'
import webpackHMRMiddleware from './middleware/webpack-hmr'
import fallback from 'express-history-api-fallback'
import session from 'express-session'
import passport from 'passport';
import connectPgSimple from 'connect-pg-simple'
import pg from 'pg'

const debug = _debug('app:server')
const paths = config.utils_paths
const app = new Express()

// ------------------------------------
// Apply Webpack HMR Middleware
// ------------------------------------
if (config.env === 'development') {
  const compiler = webpack(webpackConfig)

  // Enable webpack-dev and webpack-hot middleware
  const { publicPath } = webpackConfig.output

  app.use(webpackDevMiddleware(compiler, publicPath))
  app.use(webpackHMRMiddleware(compiler))

  // Serve static assets from ~/src/static since Webpack is unaware of
  // these files. This middleware doesn't need to be enabled outside
  // of development since this directory will be copied into ~/dist
  // when the application is compiled.
  app.use(Express.static('static'))
} else {
  debug(
    'Server is being run outside of live development mode, meaning it will ' +
    'only serve the compiled application bundle in ~/dist. Generally you ' +
    'do not need an application server for this and can instead use a web ' +
    'server such as nginx to serve your static files. See the "deployment" ' +
    'section in the README for more information on deployment strategies.'
  )

  // Serving ~/dist by default. Ideally these files should be served by
  // the web server and not the app server, but this helps to demo the
  // server in production.
  app.use(Express.static(paths.dist()))
}

// This rewrites all routes requests to the root /index.html file
// (ignoring file requests). If you want to implement isomorphic
// rendering, you'll want to remove this middleware.
app.use(fallback('index.html', { root: paths.dist() }))

var pgSession = connectPgSimple(session)
app.use(session({
  store: new pgSession({
    pg: pg,
    conString: 'postgres://kwikcash_dev:TPIN6u$OfbP9@kwikcash-app-db.cfmywxse2pds.us-east-1.rds.amazonaws.com:5432/kwikcash_app',
    schemaName: 'kwikca5_wp'
  }),
  secret: 'kwikCash198elkjdf9Xkd',
  resave: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));

app.use(passport.initialize());
app.use(passport.session());

export default app
