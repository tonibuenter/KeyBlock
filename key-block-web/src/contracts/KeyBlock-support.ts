import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { errorMessage, isStatusMessage, StatusMessage } from '../types';
import moment from 'moment';
import { getNetworkId } from '../redux-support';
import { getContractAddressByNetworkId, getBlockchainByNetworkId } from '../components/Web3InfoPage';

const { abi } = require('./KeyBlock.json');
let currentNetworkId = 0;

let KeyBlockContract: Contract | undefined;

export function getKeyBlockContract(web3: Web3): Contract | StatusMessage {
  const networkId = getNetworkId();
  if (!getContractAddressByNetworkId(networkId)) {
    return errorMessage(`No contract found for ${getBlockchainByNetworkId(networkId)}`);
  }
  if (networkId !== currentNetworkId) {
    currentNetworkId = networkId;
    const contractAddress = getContractAddressByNetworkId(currentNetworkId);
    KeyBlockContract = new web3.eth.Contract(abi, contractAddress);
  }
  // if (!KeyBlockContract) {
  //   KeyBlockContract = new web3.eth.Contract(abi, contractAddress);
  // }
  if (!KeyBlockContract) {
    throw new Error(`No KeyBlock contract for this network ${getBlockchainByNetworkId(networkId)}`);
  }
  return KeyBlockContract;
}

export async function KeyBlock_len(web3: Web3, from: string): Promise<number | StatusMessage> {
  try {
    const contract = getKeyBlockContract(web3);
    if (isStatusMessage(contract)) {
      return contract;
    }
    const res = await contract.methods.len().call({ from });
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
    return await contract.methods.get(index).call({ from });
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
    return await contract.methods.add(name, secretContent, inserted).send({ from });
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
    return await contract.methods.set(index, name, secretContent, inserted).send({ from });
  } catch (e) {
    console.error('KeyBlock_set failed', e);
    return errorMessage('Could not call save Entry', e);
  }
}
