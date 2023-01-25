import { combineReducers } from 'redux';
import { State } from './state';
import { appReducer } from './app/reducer';

export const rootReducers = combineReducers<State>({
  app: appReducer,
});
