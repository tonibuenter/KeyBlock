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
                </TableRow>
                <TableRow key={'home-page'}>
                  <TableCell key={'name'}>Home Page</TableCell>
                  <TableCell key={'value'}>
                    {homePage ? (
                      <a target={'_blank'} href={homePage} rel="noreferrer">
                        {homePage}
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
