import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import DevTools from './DevTools'
import config from '../../server/config'

const loggerMiddleware = createLogger()

const enhancer = compose(
  // Middleware you want to use in development:
  applyMiddleware(thunkMiddleware, loggerMiddleware),

  window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument()
);

export default function configureStore(rootReducer, reducerPath) {
  // Note: only Redux >= 3.1.0 supports passing enhancer as third argument.
  // See https://github.com/rackt/redux/releases/tag/v3.1.0
  const store = createStore(rootReducer, enhancer); // initialState would be 2nd param

  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  if (config.env === 'development' && module.hot) {
    module.hot.accept(reducerPath, () =>
      store.replaceReducer(require(reducerPath)/*.default if you use Babel 6+ */)
    );
  }

  return store;
}