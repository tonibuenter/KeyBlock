import { useCallback, useEffect, useState } from 'react';
import Web3 from 'web3';
import {
  dispatchAddressBook,
  dispatchNetworkId,
  dispatchPublicAddress,
  dispatchPublicKeyHolder,
  dispatchStatusMessage,
  dispatchWeb3
} from '../redux-support';
import { Box, Button, Stack } from '@mui/material';

import logo from '../images/keyblock200.png';
import { AddressBookEntry, errorMessage, HolderType, isStatusMessage, PublicKeyHolder } from '../types';
import { useNavigate } from 'react-router-dom';
import { PublicKeyStore_getMine } from '../contracts/public-key-store/PublicKeyStore-support';

const addressBook: AddressBookEntry[] = [
  {
    address: '0xD2D6e53496cB9039fA6EF317791B5ABe9D299cc4',
    name: 'Toni A. Buenter (main)'
  },
  {
    address: '0x3653Ce393b0f6C10DdfFC7435b7163a3a1Faf208',
    name: 'Toni_208'
  },
  {
    address: '0xa04A5f2125424Ae8f47aCAC87880724AF5710100',
    name: 'MM-0100-Toni (test)'
  },
  {
    address: '0x17ae393c16B1FC7342e491aD97311A3b31160101',
    name: 'MM-0101-Dani (test)'
  },
  {
    address: '0x06C501009837a6F03B01FdCCb52BC8ce6Bea0103',
    name: 'MM-0103-Jerry (test)'
  }
];

const Login: React.FC = () => {
  const w: any = window;
  const navigate = useNavigate();
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    if (w.ethereum) {
      w.web3 = new Web3(w.ethereum);
      dispatchWeb3(w.web3);
    }
  }, [w]);

  let handleEthereum: () => Promise<void>;
  handleEthereum = useCallback(async () => {
    if (connected) {
      return;
    }
    setConnected(true);
    try {
      if (!w.ethereum) {
        dispatchStatusMessage(errorMessage('Can not connect to Wallet!', 'window.ethereum id not initialized!'));
        return;
      }

      await w.ethereum.enable();

      // We don't know window.web3 version, so we use our own instance of Web3
      // with the injected provider given by MetaMask
      const web3 = new Web3(w.ethereum);
      dispatchWeb3(web3);

      w?.ethereum?.on('accountsChanged', () =>
        // e: never
        {
          // const newPublicAddress = e[0];
          // dispatchPublicAddress(newPublicAddress);
          w?.location?.reload();
        }
      );

      w?.ethereum?.on('networkChanged', () =>
        // networkId: never
        {
          // if (+networkId) {
          //   dispatchNetworkId(+networkId);
          // }
          w?.location?.reload();
        }
      );

      const networkId = await getCurrentNetworkId(web3);
      if (networkId) {
        dispatchNetworkId(networkId);
      } else {
        dispatchStatusMessage(errorMessage('Web3 could not detect network!'));
        return;
      }

      const publicAddress = await getCurrentAddress(web3);

      // PUBLIC ADDRESS & PUBLIC KEY
      if (!publicAddress) {
        dispatchStatusMessage(errorMessage('Please open MetaMask first.', 'Web3 could not detect a public address!'));
        return;
      }
      const publicKeyHolder = await getPublicKey64(web3, publicAddress);
      dispatchPublicKeyHolder(publicKeyHolder);
      dispatchPublicAddress(publicAddress);
      navigate('/menu');

      // ADDRESS BOOK
      dispatchAddressBook(addressBook);
    } catch (error) {
      dispatchStatusMessage(errorMessage('Error occurred while connecting to Wallet', error));
    }
  }, [w, connected, navigate]);

  const connectMetaMask = useCallback(() => {
    if (w.ethereum) {
      handleEthereum().catch(console.error);
    } else {
      window.addEventListener(
        'ethereum#initialized',
        () => {
          handleEthereum().catch(console.error);
        },
        {
          once: true
        }
      );

      // If the event is not dispatched by the end of the timeout,
      // the user probably doesn't have MetaMask installed.
      setTimeout(() => {
        handleEthereum().catch(console.error);
      }, 3000); // 3 seconds
    }
  }, [w, handleEthereum]);

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
  let holder: HolderType = 'public-key-store';
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
    holder = 'wallet';
  }
  return { publicKey, holder };
}

async function getCurrentNetworkId(web3: Web3): Promise<number> {
  return +((await web3.eth.net.getId()) || '-1').toString();
}
