import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { errorMessage, StatusMessage } from '../types';
import moment from 'moment';

const contractAddress = process.env['REACT_APP_POLYSAFE_CONTRACT'];
const { abi } = require('./KeyBlock.json');

let KeyBlockContract: Contract | undefined;

export function getKeyBlockContract(web3: Web3) {
  if (!KeyBlockContract) {
    KeyBlockContract = new web3.eth.Contract(abi, contractAddress);
  }
  return KeyBlockContract;
}

export async function KeyBlock_len(web3: Web3, from: string): Promise<number | StatusMessage> {
  try {
    const contract = getKeyBlockContract(web3);
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
    return await contract.methods.add(name, secretContent, inserted).send({ from });
  } catch (e) {
    console.error('KeyBlock_add failed', e);
    return errorMessage('Could not add entry', e);
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
    return await contract.methods.set(index, name, secretContent, inserted).send({ from });
  } catch (e) {
    console.error('KeyBlock_set failed', e);
    return errorMessage('Could not call save Entry', e);
  }
}
