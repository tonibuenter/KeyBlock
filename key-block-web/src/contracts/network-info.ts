import { NetworkInfo } from '../types';

export enum ContractName {
  KeyBlock = 'KEYBLOCK',
  PublicKeyStore = 'PUBLICKEYSTORE',
  PrivateMessageStore = 'PRIVATEMESSAGESTORE'
}

export const networks: NetworkInfo[] = [
  {
    name: 'n/a',
    chainId: 0,
    currencySymbol: 'n/a',
    blockExplorerUrl: 'n/a',
    rpcUrl: 'n/a',
    PostFix: ''
  },
  {
    name: 'Ethereum Mainnet',
    chainId: 1,
    currencySymbol: 'ETH',
    blockExplorerUrl: 'https://etherscan.io',
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR-PROJECT-ID',
    PostFix: 'ETHEREUM_MAINNET'
  },
  {
    name: 'Rinkeby Testnet',
    chainId: 4,
    currencySymbol: 'ETH',
    blockExplorerUrl: 'https://rinkeby.etherscan.io',
    rpcUrl: 'https://rinkeby.infura.io/v3/YOUR-PROJECT-ID',
    PostFix: 'ETHEREUM_RINKEBY'
  },
  {
    name: 'Goerli Testnet',
    chainId: 5,
    currencySymbol: 'ETH',
    blockExplorerUrl: '',
    rpcUrl: '',
    PostFix: 'ETHEREUM_GOERLI'
  },
  {
    name: 'Binance Smart Chain Mainnet',
    chainId: 56,
    currencySymbol: 'BNB',
    blockExplorerUrl: 'https://bscscan.com',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    PostFix: ''
  },
  {
    name: 'Binance Smart Chain Testnet',
    chainId: 97,
    currencySymbol: 'BNB',
    blockExplorerUrl: 'https://testnet.bscscan.com',
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    PostFix: ''
  },
  {
    name: 'Polygon (Matic) Mainnet',
    chainId: 137,
    currencySymbol: 'MATIC',
    blockExplorerUrl: 'https://polygonscan.com',
    rpcUrl: 'https://rpc-mainnet.maticvigil.com',
    PostFix: ''
  },
  {
    name: 'Mumbai Testnet',
    chainId: 80001,
    currencySymbol: 'MATIC',
    blockExplorerUrl: 'https://mumbai.polygonscan.com',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    PostFix: 'POLYGON_MUMBAI'
  },
  {
    name: 'Fantom Opera Mainnet',
    chainId: 250,
    currencySymbol: 'FTM',
    blockExplorerUrl: 'https://ftmscan.com',
    rpcUrl: 'https://rpcapi.fantom.network',
    PostFix: 'FANTOM_MAINNET',
    homePage: 'https://fantom.foundation'
  },
  {
    name: 'Fantom Testnet',
    chainId: 4002,
    currencySymbol: 'FTM',
    blockExplorerUrl: 'https://explorer.testnet.fantom.network',
    rpcUrl: 'https://rpc.testnet.fantom.network',
    PostFix: 'FANTOM_TESTNET'
  },
  {
    name: 'Moonriver Mainnet',
    chainId: 1285,
    currencySymbol: 'MOVR',
    blockExplorerUrl: 'https://blockscout.moonbeam.network/moonriver',
    rpcUrl: 'https://rpc.moonriver.moonbeam.network',
    PostFix: ''
  },
  {
    name: 'Optimistic Ethereum',
    chainId: 10,
    currencySymbol: 'ETH',
    blockExplorerUrl: 'https://optimistic.etherscan.io',
    rpcUrl: 'https://mainnet.optimism.io',
    PostFix: ''
  }
];

export const getNetworkInfo = (chainId: number): NetworkInfo =>
  networks.find((n) => n.chainId === chainId) || networks[0];

export function getContractAddress(networkId: number, contractName: ContractName): string {
  const network = getNetworkInfo(networkId);
  const envName = `REACT_APP_CONTRACT_${contractName}_${network.PostFix}`;
  return process.env[envName] || '';
}
