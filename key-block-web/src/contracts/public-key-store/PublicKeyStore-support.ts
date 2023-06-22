import Web3 from 'web3';
import {Contract} from 'web3-eth-contract';
import {errorMessage, isStatusMessage, StatusMessage} from '../../types';
import {getNetworkId} from '../../redux-support';
import {getBlockchainByNetworkId} from '../../components/Web3InfoPage';
import {abi} from './PublicKeyStore';

let currentNetworkId = 0;


type ContractType = typeof abi;

let PublicKeyStoreContract: Contract<ContractType> | undefined;

export function getPublicKeyStoreContract(web3: Web3): Contract<ContractType> | StatusMessage {
  const networkId = getNetworkId();
  if (networkId !== currentNetworkId) {
    currentNetworkId = networkId;
  }
  const contractAddress = getPublicKeyStoreContractAddressByNetworkId(currentNetworkId);

  if (!contractAddress) {
    return errorMessage(`No contract found for ${getBlockchainByNetworkId(networkId)}`);
  }
  PublicKeyStoreContract = new Contract(abi, contractAddress, web3);
  if (!PublicKeyStoreContract) {
    throw new Error(`No PublicKeyStore contract for this network ${getBlockchainByNetworkId(networkId)}`);
  }
  return PublicKeyStoreContract;
}

export async function PublicKeyStore_getMine(web3: Web3, from: string): Promise<string | StatusMessage> {
  try {
    const contract = getPublicKeyStoreContract(web3);
    if (isStatusMessage(contract)) {
      return contract;
    }
    const r = await contract.methods.getMine().call({from})
    return r as any;
  } catch (e) {
    console.error('PublicKeyStore_getMine failed', e);
    return errorMessage('Could not call PublicKeyStore_getMine', e);
  }
}

export async function PublicKeyStore_get(web3: Web3, from: string, address: string): Promise<string | StatusMessage> {
  try {
    const contract = getPublicKeyStoreContract(web3);
    if (isStatusMessage(contract)) {
      return contract;
    }
    const res = await contract.methods.get(address).call({from});
    return res.toString();
  } catch (e) {
    console.error('PublicKeyStore_get failed', e);
    return errorMessage('Could not get entry', e);
  }
}

export async function PublicKeyStore_set(web3: Web3, from: string, publicKey: string): Promise<string | StatusMessage> {
  try {
    const contract = getPublicKeyStoreContract(web3);
    if (isStatusMessage(contract)) {
      return contract;
    }
    await contract.methods.set(publicKey).send({from});
    return 'ok'
  } catch (e) {
    console.error('PublicKeyStore_set failed', e);
    return errorMessage('Could not call save Entry', e);
  }
}

export function getPublicKeyStoreContractAddressByNetworkId(networkId: number): string | undefined {
  switch (networkId) {
    case 1:
      return process.env['REACT_APP_CONTRACT_PUBLICKEYSTORE_ETHEREUM_MAINNET'];
    case 3:
    case 4:
    case 5:
      return process.env['REACT_APP_CONTRACT_PUBLICKEYSTORE_ETHEREUM_GOERLI'];

    case 42:
      return '';
    case 56:
    case 97:
      return '';
    case 100:
      return '';
    case 250:
      return process.env['REACT_APP_CONTRACT_PUBLICKEYSTORE_FANTOM_MAINNET'];
    case 4002:
      // FANTOM_TESTNET;
      return process.env['REACT_APP_CONTRACT_PUBLICKEYSTORE_FANTOM_TESTNET'];
    case 5777:
      return '';
    case 137:
      return process.env['REACT_APP_CONTRACT_PUBLICKEYSTORE_POLYGON_MAINNET'];
    case 80001:
      return process.env['REACT_APP_CONTRACT_PUBLICKEYSTORE_POLYGON_MUMBAI'];
    default:
      return;
  }
}
