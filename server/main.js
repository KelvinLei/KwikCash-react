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
import path from 'path'
import json2xls from 'json2xls'

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

  app.get('/admin', function(req, res){
    var filename = path.join(compiler.outputPath,'adminIndex.html');
    compiler.outputFileSystem.readFile(filename, function(err, result){
      if (err) {
        return next(err);
      }
      res.set('content-type','text/html');
      res.send(result);
      res.end();
    });
  })
} else {
  debug(
    'Server is being run outside of live development mode, meaning it will ' +
    'only serve the compiled application bundle in ~/dist. Generally you ' +
    'do not need an application server for this and can instead use a web ' +
    'server such as nginx to serve your static files. See the "deployment" ' +
    'section in the README for more information on deployment strategies.'
  )

  /*
   Because behind the AWS load balancer, all the communication are done over http,
   a global redirection instruction would create an infinite redirection loop.

   AWS ELB adds a X-Forwarded-Proto header that you can capture to know what was
   the protocol used before the load balancer (http or https)
  */
  app.get('*', function(req, res, next) {
    if(!req.secure && req.get('X-Forwarded-Proto') !== 'https') {
      res.redirect('https://' + req.get('Host') + req.url);
    }
    else
      next();
  });

  // Serving ~/dist by default. Ideally these files should be served by
  // the web server and not the app server, but this helps to demo the
  // server in production.
  app.use(Express.static(paths.dist()))
}

app.get('/admin', function(req, res){
  res.sendFile('adminIndex.html', { root: paths.dist() });
});

app.get('/admin/*', function(req, res){
  res.sendFile('adminIndex.html', { root: paths.dist() });
});

// This rewrites all routes requests to the root /index.html file
// (ignoring file requests). If you want to implement isomorphic
// rendering, you'll want to remove this middleware.
// app.use(fallback('index.html', { root: paths.dist() }))
app.get('*', function(req, res){
  res.sendFile('index.html', { root: paths.dist() });
});

app.use('/api/admin', expressJwt({secret: config.admin_jwt_secret}).unless((req) => {
  if (req.originalUrl.startsWith('/api/admin/authenticate')) {
    return true;
  }
  if (req.originalUrl.startsWith('/api/admin')) {
    return false;
  }

}));
app.use('/api', expressJwt({secret: config.jwt_secret}).unless((req) => {
  if (req.originalUrl.startsWith('/api/admin')) {
    return true;
  }
  if (req.originalUrl.startsWith('/api/authenticate')) {
    return true;
  }
  if (req.originalUrl.startsWith('/api')) {
    return false;
  }

}));
app.use(bodyParser.json());

// enable the ability to return an excel file response
app.use(json2xls.middleware);

export default app
