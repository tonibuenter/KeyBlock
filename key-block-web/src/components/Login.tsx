import { useEffect } from 'react';
import Web3 from 'web3';
import {
  dispatchNetworkId,
  dispatchPublicAddress,
  dispatchPublicKey,
  dispatchStatusMessage,
  dispatchWeb3
} from '../redux-support';
import { Box, Button, Stack } from '@mui/material';

import logo from '../images/keyblock200.png';
import { errorMessage } from '../types';

const Login: React.FC = () => {
  const w: Window & any = window;

  useEffect(() => {
    if (w.ethereum) {
      w.web3 = new Web3(w.ethereum);
      dispatchWeb3(w.web3);
    }
  }, [w]);

  const connectMetaMask = async () => {
    try {
      await w.ethereum.enable();

      // We don't know window.web3 version, so we use our own instance of Web3
      // with the injected provider given by MetaMask
      const web3 = new Web3(w.ethereum);
      dispatchWeb3(web3);

      w?.ethereum?.on('accountsChanged', (e: never) => {
        const newPublicAddress = e[0];
        dispatchPublicAddress(newPublicAddress);
        //w?.location?.reload();
      });

      w?.ethereum?.on('networkChanged', (networkId: never) => {
        console.debug('Network changed', networkId);
        if (+networkId) {
          dispatchNetworkId(+networkId);
        }
      });

      const networkId = await getCurrentNetworkId(web3);
      if (networkId) {
        dispatchNetworkId(networkId);
      } else {
        dispatchStatusMessage(errorMessage('Web3 could not detect network!'));
        return;
      }

      const publicAddress = await getCurrentAddress(web3);

      if (!publicAddress) {
        dispatchStatusMessage(errorMessage('Please open MetaMask first.', 'Web could not detect an public address!'));
        return;
      } else {
        const publicKey = await getPublicKey64(publicAddress);
        dispatchPublicKey(publicKey);
        dispatchPublicAddress(publicAddress);
      }
    } catch (error) {
      dispatchStatusMessage(errorMessage('Error occurred while connecting to Wallet', error));
    }
  };

  return (
    <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
      <Box sx={{ padding: '2em', margin: '2em', boxShadow: '2px 2px 10px lightgrey' }}>
        <img src={logo} alt={'logo'} />
      </Box>
      <Button onClick={connectMetaMask}>Connect MetaMask</Button>
    </Stack>
  );
};

export default Login;

async function getCurrentAddress(web3: Web3) {
  const coinbase = await web3.eth.getCoinbase();
  let addr = coinbase;
  if (Array.isArray(coinbase)) {
    addr = coinbase[0];
  }
  if (!addr) {
    return;
  }

  return addr.toLowerCase();
}

export async function getPublicKey64(publicAddress: string): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  return (await w?.ethereum?.request({
    method: 'eth_getEncryptionPublicKey',
    params: [publicAddress]
  })) as string;
}

async function getCurrentNetworkId(web3: Web3) {
  return (await web3.eth.net.getId()) || -1;
}
