import { createStore, Store } from 'redux';
import { KeyBlockReduxState } from './types';

export const ACTIONS = {
  UPDATE: 'UPDATE'
};

const initialState = (): KeyBlockReduxState => ({});

export let store: Store<KeyBlockReduxState>;

export const getStore = () => store;

export function reducer0(state: KeyBlockReduxState | undefined, action: any): KeyBlockReduxState {
  if (state === undefined) {
    state = initialState();
  }
  switch (action.type) {
    case ACTIONS.UPDATE: {
      const data = action.payload as Record<string, any>;
      return { ...state, ...data };
    }

    default:
      return state;
  }
}

export function createReduxStore(): Store<KeyBlockReduxState> {
  if (store) {
    return store;
  }
  console.debug('createReduxStore');
  store = createStore(reducer0);
  return store;
}
