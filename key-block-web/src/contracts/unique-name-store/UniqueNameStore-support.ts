import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { errorMessage, isStatusMessage, StatusMessage } from '../../types';
import { getNetworkId } from '../../redux-support';
import { uniqueNameStoreAbi } from './UniqueNameStore-abi';
import { ContractName, getContractAddress, getNetworkInfo } from '../network-info';

let currentNetworkId = 0;

type ContractType = typeof uniqueNameStoreAbi;

let UniqueNameStoreContract: Contract<ContractType> | undefined;

export function getUniqueNameStoreContract(web3: Web3): Contract<ContractType> | StatusMessage {
  const networkId = getNetworkId();
  if (networkId !== currentNetworkId) {
    currentNetworkId = networkId;
  }
  const networkInfo = getNetworkInfo(networkId);
  const contractAddress = getContractAddress(currentNetworkId, ContractName.UniqueNameStore);

  if (!contractAddress) {
    return errorMessage(`No contract found on ${networkInfo.name} for Unique Name Store`);
  }
  UniqueNameStoreContract = new Contract(uniqueNameStoreAbi, contractAddress, web3);
  if (!UniqueNameStoreContract) {
    throw new Error(`Could not create contract for Unique Name Store for the network ${networkInfo.name}`);
  }
  return UniqueNameStoreContract;
}

export async function UniqueNameStore_getName(
  web3: Web3,
  address: string,
  from: string
): Promise<string | StatusMessage> {
  try {
    const contract = getUniqueNameStoreContract(web3);
    if (isStatusMessage(contract)) {
      return contract;
    }
    return await contract.methods.addressToNameMap(address).call({ from });
  } catch (e) {
    console.error('UniqueNameStore_getByAddress failed', e);
    return errorMessage('Could not call UniqueNameStore_getByAddress', e);
  }
}

export async function UniqueNameStore_getAddress(
  web3: Web3,
  name: string,
  from: string
): Promise<string | StatusMessage> {
  try {
    const contract = getUniqueNameStoreContract(web3);
    if (isStatusMessage(contract)) {
      return contract;
    }
    return await contract.methods.nameToAddressMap(name).call({ from });
  } catch (e) {
    console.error('UniqueNameStore_getByAddress failed', e);
    return errorMessage('Could not call UniqueNameStore_getByAddress', e);
  }
}

export async function UniqueNameStore_setName(web3: Web3, name: string, from: string): Promise<string | StatusMessage> {
  try {
    const contract = getUniqueNameStoreContract(web3);
    if (isStatusMessage(contract)) {
      return contract;
    }
    await contract.methods.setName(name).send({ from });
    return 'ok';
  } catch (e) {
    console.error('UniqueNameStore_setName failed', e);
    return errorMessage('Could not call UniqueNameStore_setName', e);
  }
}

export async function UniqueNameStore_unSetName(web3: Web3, from: string): Promise<string | StatusMessage> {
  try {
    const contract = getUniqueNameStoreContract(web3);
    if (isStatusMessage(contract)) {
      return contract;
    }
    await contract.methods.unSetName().send({ from });
    return 'ok';
  } catch (e) {
    console.error('UniqueNameStore_unSetName failed', e);
    return errorMessage('Could not call UniqueNameStore_unSetName', e);
  }
}
