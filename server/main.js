import Express from 'express'
import webpack from 'webpack'
import webpackConfig from '../webpack/webpack.config'
import _debug from 'debug'
import config from './config/'
import webpackDevMiddleware from './middleware/webpack-dev'
import webpackHMRMiddleware from './middleware/webpack-hmr'
import fallback from 'express-history-api-fallback'
import expressJwt from 'express-jwt'
import bodyParser from 'body-parser'

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

  /*
   Because behind the AWS load balancer, all the communication are done over http,
   a global redirection instruction would create an infinite redirection loop.

   AWS ELB adds a X-Forwarded-Proto header that you can capture to know what was
   the protocol used before the load balancer (http or https)
   */

}

app.use('*', function(req, res){
  debug(`in first get *********** : ${req.secure}`)
});

app.get('*', function(req, res, next){
  debug(`in second get *********** : ${req.secure}`)
});

app.use('*', function(req, res, next){
  debug(`in first use *********** : ${req.secure}`)
});

app.use("^(.(?!api))*$", function(req, res, next) {
  debug(`req.secure: ${req.secure}`)
  debug(`req.X-Forwarded-Proto: ${req.get('X-Forwarded-Proto')}`)

  if((!req.secure) && (req.get('X-Forwarded-Proto') !== 'https')) {
    res.redirect('https://' + req.get('Host') + req.url);
  }
  else
    next();
});

// This rewrites all routes requests to the root /index.html file
// (ignoring file requests). If you want to implement isomorphic
// rendering, you'll want to remove this middleware.
// app.use(fallback('index.html', { root: paths.dist() }))
app.get('*', function(req, res){
  debug('in rewrite get. Rerouting to index.html')
  res.sendFile('index.html', { root: paths.dist() });
});

app.use('/api', expressJwt({secret: config.jwt_secret}).unless({path: ['/api/authenticate']}));
app.use(bodyParser.json());

export default app
