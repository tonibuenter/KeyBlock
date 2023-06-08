import { useEffect } from 'react';
import Web3 from 'web3';
import {
  dispatchNetworkId,
  dispatchPublicAddress,
  dispatchPublicKeyHolder,
  dispatchStatusMessage,
  dispatchWeb3
} from '../redux-support';
import { Box, Button, Stack } from '@mui/material';

import logo from '../images/keyblock200.png';
import { errorMessage, HolderType, isStatusMessage, PublicKeyHolder } from '../types';
import { useNavigate } from 'react-router-dom';
import { PublicKeyStore_getMine } from '../contracts/public-key-store/PublicKeyStore-support';

const Login: React.FC = () => {
  const w: any = window;
  const navigate = useNavigate();

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
        // const newPublicAddress = e[0];
        // dispatchPublicAddress(newPublicAddress);
        w?.location?.reload();
      });

      w?.ethereum?.on('networkChanged', (networkId: never) => {
        // if (+networkId) {
        //   dispatchNetworkId(+networkId);
        // }
        w?.location?.reload();
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
        const publicKeyHolder = await getPublicKey64(web3, publicAddress);
        dispatchPublicKeyHolder(publicKeyHolder);
        dispatchPublicAddress(publicAddress);
        navigate('/menu');
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

export async function getPublicKey64(web3: Web3, publicAddress: string): Promise<PublicKeyHolder> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let publicKey = await PublicKeyStore_getMine(web3, publicAddress);
  let holder: HolderType = 'wallet';
  if (isStatusMessage(publicKey)) {
    console.log(`No Public Key Store contract for: ${publicAddress}`);
    publicKey = '';
  }
  if (!publicKey) {
    const w = window as any;
    publicKey = (await w?.ethereum?.request({
      method: 'eth_getEncryptionPublicKey',
      params: [publicAddress]
    })) as string;
    holder = 'public-key-store';
  }
  return { publicKey, holder };
}

async function getCurrentNetworkId(web3: Web3) {
  return (await web3.eth.net.getId()) || -1;
}
