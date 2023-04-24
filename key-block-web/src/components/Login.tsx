import { useEffect } from 'react';
import Web3 from 'web3';
import { dispatchPublicAddress, dispatchPublicKey, dispatchStatusMessage, dispatchWeb3 } from '../redux-support';
import { Box, Button, Stack } from '@mui/material';

import logo from '../images/keyblock.png';

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
        w?.location?.reload();
      });

      const publicAddress = await getCurrentAddress(web3);

      if (!publicAddress) {
        dispatchStatusMessage({ status: 'error', userMessage: 'Please open MetaMask first.' });
      } else {
        const publicKey = await getPublicKey64(publicAddress);
        dispatchPublicKey(publicKey);
        dispatchPublicAddress(publicAddress);
      }
    } catch (error) {
      console.error(error);
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
