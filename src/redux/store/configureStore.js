import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'

const loggerMiddleware = createLogger()

const enhancer = compose(
  // Middleware you want to use in development:
  applyMiddleware(thunkMiddleware, loggerMiddleware),
  typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f
);

export default function configureStore(rootReducer, initialState) { 
  return createStore(rootReducer, initialState, enhancer);
};
