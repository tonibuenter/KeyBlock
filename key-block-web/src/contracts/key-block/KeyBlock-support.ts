import Web3 from 'web3';
import {Contract} from 'web3-eth-contract';
import {errorMessage, isStatusMessage, StatusMessage} from '../../types';
import moment from 'moment';
import {getNetworkId} from '../../redux-support';
import {getBlockchainByNetworkId, getContractAddressByNetworkId} from '../../components/Web3InfoPage';

import {abi} from './KeyBlock'

type KbContractType = typeof abi;

let currentNetworkId = 0;

let KeyBlockContract: Contract<KbContractType> | undefined;

export function getKeyBlockContract(web3: Web3): Contract<KbContractType> | StatusMessage {
  const networkId = getNetworkId();
  if (networkId !== currentNetworkId) {
    currentNetworkId = networkId;
  }
  const contractAddress = getContractAddressByNetworkId(currentNetworkId);
  if (!contractAddress) {
    return errorMessage(`No contract found for ${getBlockchainByNetworkId(networkId)}`);
  }
  KeyBlockContract = new web3.eth.Contract(abi, contractAddress, web3);
  if (!KeyBlockContract) {
    throw new Error(`No KeyBlock contract for this network ${getBlockchainByNetworkId(currentNetworkId)}`);
  }
  return KeyBlockContract;
}

export async function KeyBlock_len(web3: Web3, from: string): Promise<number | StatusMessage> {
  try {
    const contract = getKeyBlockContract(web3);
    if (isStatusMessage(contract)) {
      return contract;
    }
    const res = await contract.methods.len().call({from});
    return +res.toString();
  } catch (e) {
    console.error('KeyBlock_len failed', e);
    return errorMessage('Could not call KeyBlock_len', e);
  }
}

export async function KeyBlock_get(web3: Web3, from: string, index: number): Promise<string[] | StatusMessage> {
  try {
    const contract = getKeyBlockContract(web3);
    if (isStatusMessage(contract)) {
      return contract;
    }
    return await contract.methods.get(index).call({from});
  } catch (e) {
    console.error('KeyBlock_get failed', e);
    return errorMessage('Could not get entry', e);
  }
}

export async function KeyBlock_add(
    web3: Web3,
    from: string,
    name: string,
    secretContent: string
): Promise<string | StatusMessage> {
  const inserted = moment().format('YYYY-MM-DD HH:mm');
  try {
    const contract = getKeyBlockContract(web3);
    if (isStatusMessage(contract)) {
      return contract;
    }
    await contract.methods.add(name, secretContent, inserted).send({from});
    return 'ok'
  } catch (e) {
    console.error('KeyBlock_add failed', e);
    return errorMessage('Could not add KeyBlock entry', e);
  }
}

export async function KeyBlock_set(
    web3: Web3,
    from: string,
    index: number,
    name: string,
    secretContent: string
): Promise<string | StatusMessage> {
  const inserted = moment().format('YYYY-MM-DD HH:mm');
  try {
    const contract = getKeyBlockContract(web3);
    if (isStatusMessage(contract)) {
      return contract;
    }
    await contract.methods.set(index, name, secretContent, inserted).send({from});
    return 'ok'
  } catch (e) {
    console.error('KeyBlock_set failed', e);
    return errorMessage('Could not call save Entry', e);
  }
}

export type Item = { index: number; name: string; secret: string; inserted: string };
export const EmptyItem: Item = {index: -1, name: '', secret: '', inserted: ''};
