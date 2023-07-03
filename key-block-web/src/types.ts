import Web3 from 'web3';

export function isError(e: any): e is Error {
  return e && e.message;
}

export type AddressBookEntry = { address: string; name: string };

export interface KeyBlockReduxState {
  web3?: Web3;
  statusMessage?: StatusMessage;
  snackbarMessage?: SnackbarMessage;
  publicAddress?: string;
  networkId?: number;
  publicKeyHolder?: PublicKeyHolder;
  loading?: string;
  addressBook?: AddressBookEntry[];
}

export declare type StatusMessageStatus = 'success' | 'info' | 'warning' | 'error';

export declare type StatusMessage = {
  status: StatusMessageStatus;
  userMessage?: string;
  systemMessage?: string;
  additionalSystemMessages?: string[];
};
export const errorMessage = (userMessage: string, error: Error | string | unknown = ''): StatusMessage => {
  const status = 'error';
  let systemMessage;
  if (!error) {
    systemMessage = '';
  } else if (isError(error)) {
    systemMessage = error.message;
  } else if (typeof error === 'string') {
    systemMessage = error;
  } else {
    systemMessage = error.toString();
  }
  return {
    status,
    userMessage,
    systemMessage
  };
};

export const warningMessage = (userMessage: string): StatusMessage => ({
  status: 'warning',
  userMessage: userMessage
});
export const infoMessage = (userMessage: string): StatusMessage => ({
  status: 'info',
  userMessage: userMessage
});
export const successMessage = (userMessage: string): StatusMessage => ({
  status: 'success',
  userMessage: userMessage
});

export const isStatusMessage = (arg: any): arg is StatusMessage =>
  arg && typeof arg === 'object' && arg.status && arg.userMessage;

export type NotifyFun = () => void;

// APP TYPES

export type HolderType = 'wallet' | 'public-key-store';

export interface PublicKeyHolder {
  publicKey: string;
  holder: HolderType;
}

export type SnackbarMessage = StatusMessage & { duration: number; counter: number };

export type NetworkInfo = {
  name: string;
  chainId: number;
  currencySymbol: string;
  blockExplorerUrl: string;
  rpcUrl: string;
  PostFix: string;
  homePage?: string;
};
