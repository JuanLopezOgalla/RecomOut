import { initialState } from '~/store/app/reducer';

export const allState = {
  app: initialState,
};

export type State = typeof allState;
