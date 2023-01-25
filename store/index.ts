import { useMemo } from 'react';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { rootReducers } from './reducers';
import { allState, State } from './state';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

let store;

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducers);

function initStore(preloadedState: State = allState) {
  return createStore(persistedReducer, preloadedState, composeWithDevTools(applyMiddleware(thunk)));
}

export const initializeStore = (preloadedState: State) => {
  let _store = store ?? initStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    });
    // Reset the current store
    store = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store;

  // Create the store once in the client
  if (!store) store = _store;

  store.__PERSISTOR = persistStore(store);

  return store;
};

export const useStore = initialState => {
  return useMemo(() => initializeStore(initialState), [initialState]);
};
