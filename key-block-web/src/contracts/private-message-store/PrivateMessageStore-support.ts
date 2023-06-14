import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { errorMessage, isStatusMessage, StatusMessage } from '../../types';
import { getNetworkId } from '../../redux-support';
import { getBlockchainByNetworkId } from '../../components/Web3InfoPage';
import { decryptContent, encryptContent } from '../../utils/crypt-util';

const { abi } = require('./PrivateMessageStore.json');
let currentNetworkId = 0;

let PrivateMessageStoreContract: Contract | undefined;

export function getPrivateMessageStoreContract(web3: Web3): Contract | StatusMessage {
  const networkId = getNetworkId();
  if (!getPrivateMessageStoreContractAddressByNetworkId(networkId)) {
    return errorMessage(`No contract found for ${getBlockchainByNetworkId(networkId)}`);
  }
  if (networkId !== currentNetworkId) {
    currentNetworkId = networkId;
    const contractAddress = getPrivateMessageStoreContractAddressByNetworkId(currentNetworkId);
    PrivateMessageStoreContract = new web3.eth.Contract(abi, contractAddress);
  }
  if (!PrivateMessageStoreContract) {
    throw new Error(`No PrivateMessageStore contract for this network ${getBlockchainByNetworkId(networkId)}`);
  }
  return PrivateMessageStoreContract;
}

export async function getMaxLengthText(web3: Web3): Promise<number | StatusMessage> {
  const contract = getPrivateMessageStoreContract(web3);
  return isStatusMessage(contract) ? contract : await contract.methods.MAX_LENGTH_TEXT().call();
}

export async function getMaxLengthSubject(web3: Web3): Promise<number | StatusMessage> {
  const contract = getPrivateMessageStoreContract(web3);
  return isStatusMessage(contract) ? contract : await contract.methods.MAX_LENGTH_SUBJECT().call();
}

type SendArgs = {
  address: string;
  subjectInBox: string;
  textInBox: string;
  subjectOutBox: string;
  textOutBox: string;
  contentHash: string;
};

export async function PrivateMessageStore_send(
  web3: Web3,
  from: string,
  { address, subjectInBox, textInBox, subjectOutBox, textOutBox, contentHash }: SendArgs
): Promise<void | StatusMessage> {
  try {
    //const checkResults = checkTexts(web3, subjectInBox, textInBox, subjectOutBox, textOutBox);
    // if (isStatusMessage(checkResults)) {
    //   return checkResults;
    // }
    const contract = getPrivateMessageStoreContract(web3);
    if (isStatusMessage(contract)) {
      return contract;
    }
    const tx = await contract.methods
      .send(address, subjectInBox, textInBox, subjectOutBox, textOutBox, contentHash)
      .send({ from });
    console.debug('tx', tx);
    return;
  } catch (e) {
    console.error('PrivateMessageStore_send failed', e);
    return errorMessage('Could not call PrivateMessageStore_send', e);
  }
}

export async function PrivateMessageStore_lenInBox(web3: Web3, from: string): Promise<number | StatusMessage> {
  try {
    const contract = getPrivateMessageStoreContract(web3);
    if (isStatusMessage(contract)) {
      return contract;
    }
    const res0 = await contract.methods.lenInBox().call({ from });
    return +res0;
  } catch (e) {
    console.error('PrivateMessageStore_lenInBox failed', e);
    return errorMessage('Could not call PrivateMessageStore_lenInBox', e);
  }
}

export async function PrivateMessageStore_confirm(
  web3: Web3,
  from: string,
  index: number
): Promise<void | StatusMessage> {
  try {
    const contract = getPrivateMessageStoreContract(web3);
    if (isStatusMessage(contract)) {
      return contract;
    }
    const tx = await contract.methods.confirm(index).send({ from });
    console.debug(tx);
  } catch (e) {
    console.error('PrivateMessageStore_confirm failed', e);
    return errorMessage('Could not call PrivateMessageStore_confirm', e);
  }
}

type ReplyArgs = {
  address: string;
  replySubjectInBox: string;
  replyTextInBox: string;
  replySubjectOutBox: string;
  replyTextOutBox: string;
  contentHash: string;
  replyIndex: number;
};

export async function PrivateMessageStore_reply(
  web3: Web3,
  from: string,
  {
    address,
    replySubjectInBox,
    replyTextInBox,
    replySubjectOutBox,
    replyTextOutBox,
    contentHash,
    replyIndex
  }: ReplyArgs
): Promise<void | StatusMessage> {
  try {
    const contract = getPrivateMessageStoreContract(web3);
    if (isStatusMessage(contract)) {
      return contract;
    }
    const tx = await contract.methods
      .reply(address, replySubjectInBox, replyTextInBox, replySubjectOutBox, replyTextOutBox, contentHash, replyIndex)
      .send({ from });
    console.debug('tx', tx);
    return;
  } catch (e) {
    console.error('PrivateMessageStore_reply failed', e);
    return errorMessage('Could not call PrivateMessageStore_reply', e);
  }
}

export async function PrivateMessageStore_lenOutBox(web3: Web3, from: string): Promise<number | StatusMessage> {
  try {
    const contract = getPrivateMessageStoreContract(web3);
    if (isStatusMessage(contract)) {
      return contract;
    }
    const res0 = await contract.methods.lenOutBox().call({ from });
    return +res0;
  } catch (e) {
    console.error('PrivateMessageStore_lenInBox failed', e);
    return errorMessage('Could not call PrivateMessageStore_lenInBox', e);
  }
}

export type MessageInBox = {
  sender: string;
  indexOutBox: number;
  subjectInBox: string;
  textInBox: string;
  inserted: number;

  confirmedTime: number;
  confirmed: boolean;
  hasReply: boolean;
  replyIndex: number;
  contentHash: string;
};

export type MessageOutBox = {
  receiver: string;
  indexInBox: number;
  subjectOutBox: string;
  textOutBox: string;
  contentHash: string;
};

export const EmptyMessage: MessageInBox = {
  sender: '',
  indexOutBox: 0,
  subjectInBox: '',
  textInBox: '',
  inserted: 0,

  confirmedTime: 0,
  confirmed: false,
  hasReply: false,
  replyIndex: 0,
  contentHash: ''
};

export type GetInBoxResult = {
  sender: string;
  indexOutBox: number;
  subjectInBox: string;
  textInBox: string;
  inserted: number;
  confirmedTime: number;
  confirmed: boolean;
  hasReply: boolean;
  replyIndex: number;
  contentHash: string;
  index: number;
};

export async function PrivateMessageStore_getInBox(
  web3: Web3,
  from: string,
  index: number
): Promise<GetInBoxResult | StatusMessage> {
  try {
    const contract = getPrivateMessageStoreContract(web3);
    if (isStatusMessage(contract)) {
      return contract;
    }
    const entry = await contract.methods.getInBox(index).call({ from });
    return {
      sender: entry.sender,
      indexOutBox: +entry.indexInBox,
      subjectInBox: entry.subjectInBox,
      textInBox: entry.textInBox,
      inserted: +entry.inserted,
      confirmedTime: +entry.confirmedTime,
      confirmed: entry.confirmed,
      hasReply: entry.hasReply,
      replyIndex: +entry.replyIndex,
      contentHash: entry.contentHash,
      index
    };
  } catch (e) {
    console.error('PrivateMessageStore_getInBox failed', e);
    return errorMessage('Could not get in box entry', e);
  }
}

export function getPrivateMessageStoreContractAddressByNetworkId(networkId: number): string | undefined {
  switch (networkId) {
    case 1:
      return process.env['REACT_APP_CONTRACT_PRIVATEMESSAGESTORE_ETHEREUM_MAINNET'];
    case 3:
    case 4:
    case 5:
      return process.env['REACT_APP_CONTRACT_PRIVATEMESSAGESTORE_ETHEREUM_GOERLI'];

    case 42:
      return '';
    case 56:
    case 97:
      return '';
    case 100:
      return '';
    case 250:
      return process.env['REACT_APP_CONTRACT_PRIVATEMESSAGESTORE_FANTOM_MAINNET'];
    case 4002:
      // FANTOM_TESTNET;
      return process.env['REACT_APP_CONTRACT_PRIVATEMESSAGESTORE_FANTOM_TESTNET'];
    case 5777:
      return '';
    case 137:
      return process.env['REACT_APP_CONTRACT_PRIVATEMESSAGESTORE_POLYGON_MAINNET'];
    case 80001:
      return process.env['REACT_APP_CONTRACT_PRIVATEMESSAGESTORE_POLYGON_MUMBAI'];
    default:
      return;
  }
}

// ENCRYPT MESSAGE

export type EncryptMessageArgs = {
  web3: Web3;
  address: string;
  publicKey: string;
  subject: string;
  text: string;
  nonce: number;
};

export type EncryptMessageResult = { subjectEnc: string; textEnc: string };

export async function encryptMessage({
  web3,
  address,
  publicKey,
  subject,
  text,
  nonce
}: EncryptMessageArgs): Promise<EncryptMessageResult | StatusMessage> {
  const enc = encryptContent(publicKey, { subject, text, nonce });
  const subjectMax = await getMaxLengthSubject(web3);
  if (isStatusMessage(subjectMax)) {
    return subjectMax;
  }
  const textMax = await getMaxLengthText(web3);
  if (isStatusMessage(textMax)) {
    return textMax;
  }
  const subjectEnc = enc.substring(0, +subjectMax);
  const textEnc = enc.substring(+subjectMax, +textMax);
  return { subjectEnc, textEnc };
}

// DECRYPT MESSAGE

export type DecryptMessageArgs = {
  address: string;
  subjectEnc: string;
  textEnc: string;
};
export type DecryptMessageResult = { subject: string; text: string };

export async function decryptMessage({
  address,
  subjectEnc,
  textEnc
}: DecryptMessageArgs): Promise<DecryptMessageResult | StatusMessage> {
  try {
    const enc = subjectEnc + textEnc;
    return await decryptContent<DecryptMessageResult>(address, enc);
  } catch (e) {
    return errorMessage('Error while decrypting Message', e);
  }
}

export const web3ContentHash = (web3: Web3, subject: string, text: string): string =>
  web3.utils.keccak256(subject + '-' + text);
