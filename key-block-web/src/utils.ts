import { dispatchLoading } from './redux-support';
import { errorMessage } from './types';

export async function wrapPromise<T>(promise: Promise<T>, loading = 'Loading...') {
  try {
    dispatchLoading(loading);
    return await promise;
  } catch (e) {
    return errorMessage(`Error while: ${loading}`, e);
  } finally {
    dispatchLoading('');
  }
}

export function contractList(networkId: number) {}
