import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { NotifyFun } from '../types';
import { Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useNetworkId, usePublicAddress, usePublicKey, useWeb3 } from '../redux-support';
import { useEffect, useState } from 'react';

export function Web3InfoPage({ open, done }: { open: boolean; done: NotifyFun }) {
  const networkId = useNetworkId();
  const web3 = useWeb3();
  const publicAddress = usePublicAddress();
  const publicKey = usePublicKey();
  const [loading, setLoading] = useState(false);
  const [balanceWei, setBalanceWei] = useState('');
  const [chainId, setChainId] = useState(-1);
  const [gasPriceWei, setGasPriceWei] = useState('');

  useEffect(() => {
    const load = async () => {
      if (web3 && publicAddress) {
        try {
          setLoading(true);
          const balanceWei0 = await web3.eth.getBalance(publicAddress);
          setBalanceWei(balanceWei0.toString());
          const chainId0 = await web3.eth.getChainId();
          setChainId(chainId0);
          const gasPriceWei0 = await web3.eth.getGasPrice();
          setGasPriceWei(gasPriceWei0);
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

  return (
    <Dialog open={open} onClose={done} fullWidth={true} maxWidth={'md'}>
      <DialogTitle>Web3 Info Page</DialogTitle>
      <DialogContent>
        <Stack spacing={4}>
          <DialogContentText>This info page shows information about the KeyBlock contract and more:</DialogContentText>
          <TableContainer key="table" component={Paper}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell key={'name'}>Property</TableCell>
                  <TableCell key={'value'}>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow key={'KeyBlock Contract Address'}>
                  <TableCell key={'name'}>Contract Address</TableCell>
                  <TableCell key={'value'}>{process.env['REACT_APP_POLYSAFE_CONTRACT']}</TableCell>
                </TableRow>
                <TableRow key={'Your Address'}>
                  <TableCell key={'name'}>Your Address</TableCell>
                  <TableCell key={'value'}>{publicAddress}</TableCell>
                </TableRow>
                <TableRow key={'Your Public Key'}>
                  <TableCell key={'name'}>Your Public Key</TableCell>
                  <TableCell key={'value'}>{publicKey}</TableCell>
                </TableRow>
                <TableRow key={'balance-wei'}>
                  <TableCell key={'name'}>Balance Wei</TableCell>
                  <TableCell key={'value'}>{loading ? 'loading' : balanceWei}</TableCell>
                </TableRow>
                <TableRow key={'balance-ether'}>
                  <TableCell key={'name'}>Balance {currencyByNetworkId(networkId)}</TableCell>
                  <TableCell key={'value'}>
                    {loading || !web3 ? 'loading' : web3.utils.fromWei(balanceWei, 'ether').toString()}
                  </TableCell>
                </TableRow>
                <TableRow key={'balance-networkId'}>
                  <TableCell key={'name'}>Network Name: Id</TableCell>
                  <TableCell key={'value'}>
                    {loading || !web3 ? 'loading' : getBlockchainByNetworkId(networkId)}
                  </TableCell>
                </TableRow>
                <TableRow key={'balance-chainId'}>
                  <TableCell key={'name'}>Chain Id</TableCell>
                  <TableCell key={'value'}>{loading || !web3 ? 'loading' : chainId}</TableCell>
                </TableRow>
                <TableRow key={'balance-gasPriceWei'}>
                  <TableCell key={'name'}>Gas Price Wei</TableCell>
                  <TableCell key={'value'}>{loading || !web3 ? 'loading' : gasPriceWei}</TableCell>
                </TableRow>
                <TableRow key={'block-scan'}>
                  <TableCell key={'name'}>Block Explorer</TableCell>
                  <TableCell key={'value'}>
                    <a target={'_blank'} href={blockexplorerByNetworkId(networkId)}>
                      {blockexplorerByNetworkId(networkId)}
                    </a>
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

export function getBlockchainByNetworkId(networkId: number | string): string {
  const id = +networkId || 0;
  switch (id) {
    case 1:
      return 'Ethereum Mainnet';
    case 3:
      return 'Ropsten';
    case 4:
      return 'Rinkeby';
    case 5:
      return 'Goerli';
    case 10:
      return 'Optimism Mainnet';
    case 42:
      return 'Kovan';
    case 56:
      return 'Binance Smart Chain (Mainnet)';
    case 97:
      return 'Binance Smart Chain (Testnet)';
    case 100:
      return 'xDai (Mainnet)';
    case 250:
      return 'Fantom Mainnet';
    case 4002:
      return 'Fantom Testnet';
    case 5777:
      return 'Local (Ganache): 5777';
    case 137:
      return 'Polygon Mainnet (Matic): 137';
    case 80001:
      return 'Polygon Mumbai Testnet: 80001';
    default:
      return id.toString();
  }
}

export function currencyByNetworkId(networkId: number): string {
  switch (networkId) {
    case 1:
    case 3:
    case 4:
    case 5:
    case 42:
      return 'ETH';
    case 56:
    case 97:
      return 'BNB';
    case 100:
      return 'xDai';
    case 250:
    case 4002:
      return 'FTM';
    case 5777:
      return 'Ether';
    case 137:
    case 80001:
      return 'Matic';
    default:
      return '' + networkId;
  }
}

export function blockexplorerByNetworkId(networkId: number): string {
  switch (networkId) {
    case 1:
      return 'https://etherscan.io/';
    case 3:
    case 4:
    case 5:
    case 42:
      return 'ETH';
    case 56:
    case 97:
      return 'BNB';
    case 100:
      return 'xDai';
    case 250:
    case 4002:
      // FANTOM_TESTNET;
      return 'https://testnet.ftmscan.com/';
    case 5777:
      return 'Ether';
    case 137:
    case 80001:
      return 'Matic';
    case -1:
      return 'https://optimistic.etherscan.io/';
    default:
      return '';
  }
}

export function getContractAddressByNetworkId(networkId: number): string | undefined {
  switch (networkId) {
    case 1:
      return process.env['REACT_APP_CONTRACT_ETHEREUM_MAINNET'];
    case 3:
    case 4:
    case 5:
    case 42:
      return '';
    case 56:
    case 97:
      return '';
    case 100:
      return '';
    case 250:
      return process.env['REACT_APP_CONTRACT_FANTOM_MAINNET'];
    case 4002:
      // FANTOM_TESTNET;
      return process.env['REACT_APP_CONTRACT_FANTOM_TESTNET'];
    case 5777:
      return '';
    case 137:
      return process.env['REACT_APP_CONTRACT_POLYGON_MAINNET'];
    case 80001:
      return process.env['REACT_APP_CONTRACT_POLYGON_MUMBAI'];
    default:
      return;
  }
}
