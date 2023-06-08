import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { errorMessage, isStatusMessage, StatusMessage } from '../../types';
import { getNetworkId } from '../../redux-support';
import { getBlockchainByNetworkId } from '../../components/Web3InfoPage';

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

export function getMaxLengthText(web3: Web3): number | StatusMessage {
  const contract = getPrivateMessageStoreContract(web3);
  return isStatusMessage(contract) ? contract : contract.methods.MAX_LENGTH_TEXT();
}

export function getMaxLengthSubject(web3: Web3): number | StatusMessage {
  const contract = getPrivateMessageStoreContract(web3);
  return isStatusMessage(contract) ? contract : contract.methods.MAX_LENGTH_SUBJECT();
}

type SendArgs = {
  address: string;
  subjectInBox: string;
  textInBox: string;
  subjectOutBox: string;
  textOutBox: string;
  contentHash: string;
};

function checkTexts(
  web3: Web3,
  subjectInbox: string,
  textInBox: string,
  subjectOutBox: string,
  textOutBox: string
): StatusMessage | null {
  if (subjectInbox.length >= getMaxLengthSubject(web3)) {
    return errorMessage('Message (subjectInbox) is to long!');
  } else if (textInBox.length >= getMaxLengthText(web3)) {
    return errorMessage('Message (textInBox) is to long!');
  } else if (subjectOutBox.length >= getMaxLengthSubject(web3)) {
    return errorMessage('Message (subjectOutBox) is to long!');
  } else if (textOutBox.length >= getMaxLengthText(web3)) {
    return errorMessage('Message (textOutBox) is to long!');
  }
  return null;
}

export async function PrivateMessageStore_send(
  web3: Web3,
  from: string,
  { address, subjectInBox, textInBox, subjectOutBox, textOutBox, contentHash }: SendArgs
): Promise<string | StatusMessage> {
  try {
    const checkResults = checkTexts(web3, subjectInBox, textInBox, subjectOutBox, textOutBox);
    if (checkResults) {
      return checkResults;
    }
    const contract = getPrivateMessageStoreContract(web3);
    if (isStatusMessage(contract)) {
      return contract;
    }
    return await contract.methods
      .send(address, subjectInBox, textInBox, subjectOutBox, textOutBox, contentHash)
      .call({ from });
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
    const entry = await contract.methods.get(index).call({ from });
    let i = 0;
    return {
      sender: entry[i++],
      indexOutBox: +entry[i++],
      subjectInBox: entry[i++],
      textInBox: entry[i++],
      inserted: +entry[i++],
      confirmedTime: +entry[i++],
      confirmed: entry[i++],
      hasReply: entry[i++],
      replyIndex: entry[i++],
      contentHash: entry[i++],
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
