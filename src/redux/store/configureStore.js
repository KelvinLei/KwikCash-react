import { createStore } from 'redux';

export default function configureStore(rootReducer, initialState) { 
  return createStore(rootReducer, 
            initialState, 
            typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f);
};
