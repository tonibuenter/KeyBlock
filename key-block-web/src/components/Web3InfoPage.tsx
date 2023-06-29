import * as React from 'react';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { NotifyFun } from '../types';
import { Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useNetworkId, usePublicAddress, usePublicKeyHolder, useWeb3 } from '../redux-support';
import { ContractName, getContractAddress, getNetworkInfo } from '../contracts/network-info';

export function Web3InfoPage({ open, done }: { open: boolean; done: NotifyFun }) {
  const networkId = useNetworkId();
  const web3 = useWeb3();
  const publicAddress = usePublicAddress();
  const publicKeyHolder = usePublicKeyHolder();
  const [loading, setLoading] = useState(false);
  const [balanceWei, setBalanceWei] = useState('');
  const [chainId, setChainId] = useState(-1);
  const [gasPriceWei, setGasPriceWei] = useState(-1);

  useEffect(() => {
    const load = async () => {
      if (web3 && publicAddress) {
        try {
          setLoading(true);
          const balanceWei0 = await web3.eth.getBalance(publicAddress);
          setBalanceWei(balanceWei0.toString());
          const chainId0 = await web3.eth.getChainId();
          setChainId(+chainId0.toString());
          const gasPriceWei0 = await web3.eth.getGasPrice();
          setGasPriceWei(+gasPriceWei0.toString());
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      }
    };
    load();
  }, [open, publicAddress, web3, networkId]);

  if (!open) {
    return <></>;
  }

  const { blockExplorerUrl, currencySymbol = 'n/a', name = 'n/a', homePage } = getNetworkInfo(networkId) || {};

  return (
    <Dialog open={open} onClose={done} fullWidth={true} maxWidth={'md'}>
      <DialogTitle>Web3 Info Page</DialogTitle>
      <DialogContent>
        <Stack spacing={4}>
          <DialogContentText>This info page shows information about the current blockchain</DialogContentText>
          <TableContainer key="table" component={Paper}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell key={'name'}>Property</TableCell>
                  <TableCell key={'value'}>Property Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow key={'Your Address'}>
                  <TableCell key={'name'}>Your Address</TableCell>
                  <TableCell key={'value'}>{publicAddress}</TableCell>
                </TableRow>
                <TableRow key={'Your Public Key'}>
                  <TableCell key={'name'}>Your Public Key</TableCell>
                  <TableCell key={'value'}>{publicKeyHolder?.publicKey || ''}</TableCell>
                </TableRow>
                {Object.entries(ContractName).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell key={'name'}>Contract : {key}</TableCell>
                    <TableCell key={'value'}>{getContractAddress(networkId, value)}</TableCell>
                  </TableRow>
                ))}
                <TableRow key={'balance-ether'}>
                  <TableCell key={'name'}>Balance {currencySymbol}</TableCell>
                  <TableCell key={'value'}>
                    {loading || !web3 ? 'loading' : web3.utils.fromWei(balanceWei, 'ether').toString()}
                  </TableCell>
                </TableRow>
                <TableRow key={'balance-wei'}>
                  <TableCell key={'name'}>Balance Wei</TableCell>
                  <TableCell key={'value'}>{loading ? 'loading' : balanceWei}</TableCell>
                </TableRow>
                <TableRow key={'balance-networkId'}>
                  <TableCell key={'name'}>Network Name</TableCell>
                  <TableCell key={'value'}>{loading || !web3 ? 'loading' : name}</TableCell>
                </TableRow>
                <TableRow key={'balance-chainId'}>
                  <TableCell key={'name'}>Chain Id</TableCell>
                  <TableCell key={'value'}>{loading || !web3 ? 'loading' : chainId}</TableCell>
                </TableRow>
                <TableRow key={'balance-gasPriceWei'}>
                  <TableCell key={'name'}>Gas Price Wei</TableCell>
                  <TableCell key={'value'}>{loading || !web3 ? 'loading' : gasPriceWei}</TableCell>
                </TableRow>
                <TableRow key={'block-explorer-url'}>
                  <TableCell key={'name'}>Block Explorer</TableCell>
                  <TableCell key={'value'}>
                    {blockExplorerUrl ? (
                      <a target={'_blank'} href={blockExplorerUrl} rel="noreferrer">
                        {blockExplorerUrl}
                      </a>
                    ) : (
                      'n/a'
                    )}
                  </TableCell>
                </TableRow>{' '}
                <TableRow key={'home-page'}>
                  <TableCell key={'name'}>Home Page</TableCell>
                  <TableCell key={'value'}>
                    {homePage ? (
                      <a target={'_blank'} href={homePage} rel="noreferrer">
                        {blockExplorerUrl}
                      </a>
                    ) : (
                      'n/a'
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={done}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

//
// export function getBlockchainByNetworkId(networkId: number | string): string {
//   const id = +networkId || 0;
//   switch (id) {
//     case 1:
//       return 'Ethereum Mainnet';
//     case 3:
//       return 'Ropsten';
//     case 4:
//       return 'Rinkeby';
//     case 5:
//       return 'Goerli';
//     case 10:
//       return 'Optimism Mainnet';
//     case 42:
//       return 'Kovan';
//     case 56:
//       return 'Binance Smart Chain (Mainnet)';
//     case 97:
//       return 'Binance Smart Chain (Testnet)';
//     case 100:
//       return 'xDai (Mainnet)';
//     case 250:
//       return 'Fantom Mainnet';
//     case 4002:
//       return 'Fantom Testnet';
//     case 5777:
//       return 'Local (Ganache): 5777';
//     case 137:
//       return 'Polygon Mainnet (Matic): 137';
//     case 80001:
//       return 'Polygon Mumbai Testnet: 80001';
//     default:
//       return id.toString();
//   }
// }
//
// export function currencyByNetworkId(networkId: number): string {
//   switch (networkId) {
//     case 1:
//     case 3:
//     case 4:
//     case 5:
//     case 42:
//       return 'ETH';
//     case 56:
//     case 97:
//       return 'BNB';
//     case 100:
//       return 'xDai';
//     case 250:
//     case 4002:
//       return 'FTM';
//     case 5777:
//       return 'Ether';
//     case 137:
//     case 80001:
//       return 'Matic';
//     default:
//       return '' + networkId;
//   }
// }

// export function blockexplorerByNetworkId(networkId: number): string {
//   const info = infoByNetworkId(networkId);
//   return typeof info === 'string' ? info : info.explorerUrl || '';
// }

// export type BlockChainInfo = { explorerUrl: string; addressTemplateUrl: string };

// export function infoByNetworkId(networkId: number): string | BlockChainInfo {
//   switch (networkId) {
//     case 1:
//       return 'https://etherscan.io/';
//     case 3:
//     case 4:
//       return '';
//     case 5:
//       return 'https://goerli.etherscan.io';
//     case 42:
//       return 'ETH';
//     case 56:
//     case 97:
//       return 'BNB';
//     case 100:
//       return 'xDai';
//     case 250:
//       return 'https://ftmscan.com/';
//     case 4002:
//       // FANTOM_TESTNET;
//       return {
//         explorerUrl: 'https://testnet.ftmscan.com/',
//         addressTemplateUrl: 'https://testnet.ftmscan.com/address/ADDRESS'
//       };
//     case 5777:
//       return '';
//     case 137:
//       return 'https://polygonscan.com/';
//     case 80001:
//       return 'https://mumbai.polygonscan.com/';
//     case -1:
//       return 'https://optimistic.etherscan.io/';
//     default:
//       return '';
//   }
// }
