import * as React from 'react';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { errorMessage, infoMessage, isStatusMessage, PublicKeyHolder } from '../../types';
import { Divider, Stack } from '@mui/material';
import {
  dispatchSnackbarMessage,
  useNetworkId,
  usePublicAddress,
  usePublicKeyHolder,
  useWeb3
} from '../../redux-support';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {
  PublicKeyStore_get,
  PublicKeyStore_getMine,
  PublicKeyStore_set
} from '../../contracts/public-key-store/PublicKeyStore-support';
import { StatusMessageElement } from '../utils';
import { wrapPromise } from '../../utils';
import { AddressBoxWithCopy } from '../common/AddressBoxWithCopy';
import { ContractName, getContractAddress, getNetworkInfo } from '../../contracts/network-info';

export function PublicKeyStoreUi() {
  const web3 = useWeb3();
  const publicAddress = usePublicAddress();
  const publicKeyHolder = usePublicKeyHolder();
  const [myPublicKey, setMyPublicKey] = useState('');
  const [address0, setAddress0] = useState('');
  const [publicKey0, setPublicKey0] = useState('');
  const networkId = useNetworkId();

  const { name } = getNetworkInfo(networkId);

  const getMine = useCallback(async () => {
    if (!web3 || !publicAddress) {
      return;
    }
    const myPublicKey0 = await wrapPromise(PublicKeyStore_getMine(web3, publicAddress), 'Reading my Public Key...');
    if (isStatusMessage(myPublicKey0)) {
      dispatchSnackbarMessage(myPublicKey0);
    } else if (!myPublicKey0) {
      dispatchSnackbarMessage(infoMessage(`My Public Key is not yet save on: ${name}`));
      setMyPublicKey('');
    } else {
      setMyPublicKey(myPublicKey0);
    }
  }, [web3, publicAddress, name]);

  const saveMine = useCallback(async () => {
    if (!web3 || !publicAddress || !publicKeyHolder) {
      return;
    }
    const myPublicKey0 = await wrapPromise(
      PublicKeyStore_set(web3, publicAddress, publicKeyHolder.publicKey),
      'Writing Public Key. (Checkout Meta Mask!)'
    );
    if (isStatusMessage(myPublicKey0)) {
      dispatchSnackbarMessage(myPublicKey0);
    } else {
      setMyPublicKey(myPublicKey0);
    }
  }, [web3, publicAddress, publicKeyHolder]);

  useEffect(() => {
    getMine().catch(console.error);
  }, [getMine]);

  if (!publicKeyHolder) {
    return <StatusMessageElement statusMessage={errorMessage('No public key available. Please try to login again.')} />;
  }

  const contractAddress = getContractAddress(networkId, ContractName.PublicKeyStore);
  if (!contractAddress) {
    return <StatusMessageElement statusMessage={errorMessage(`No contract found on ${name} for Public Key Store`)} />;
  }

  return (
    <Stack spacing={2}>
      <PublicKeyOnNetwork publicKeyHolder={publicKeyHolder} networkId={networkId} />

      <Stack direction={'row'} spacing={1}>
        <Button onClick={getMine}>Refresh</Button>
        <Button disabled={!!myPublicKey || !publicKeyHolder} onClick={saveMine}>
          Publish my public key
        </Button>
      </Stack>
      <Divider></Divider>
      <h3>{`Read a Public Key from ${name}`}</h3>
      <TextField
        key={'address'}
        autoFocus
        margin="dense"
        label={'For the Address'}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setAddress0(e.target.value);
        }}
        value={address0}
        fullWidth
        variant="standard"
      />
      <Stack direction={'row'} spacing={1}>
        <Button
          disabled={!address0}
          onClick={async () => {
            if (!web3 || !publicAddress) {
              return;
            }
            const key = await wrapPromise(
              PublicKeyStore_get(web3, address0, publicAddress),
              `Reading Public Key for ${address0}`
            );
            if (isStatusMessage(key)) {
              dispatchSnackbarMessage(key);
            } else {
              setPublicKey0(key);
            }
          }}
        >
          Get Public Key
        </Button>
      </Stack>
      <AddressBoxWithCopy value={publicKey0} />
    </Stack>
  );
}

function PublicKeyOnNetwork({ publicKeyHolder, networkId }: { publicKeyHolder: PublicKeyHolder; networkId: number }) {
  const { name } = getNetworkInfo(networkId);

  switch (publicKeyHolder.holder) {
    case 'wallet':
      return (
        <Stack>
          <h3>My Public Key is not yet published on {name}!</h3>
          <AddressBoxWithCopy key={'my-public-key-on'} value={publicKeyHolder.publicKey} />
        </Stack>
      );
    case 'public-key-store':
      return (
        <Stack>
          <h3>My Public Key is on : {name}</h3>
          <AddressBoxWithCopy key={'my-public-key-on'} value={publicKeyHolder.publicKey} />
        </Stack>
      );
    default:
      return <StatusMessageElement statusMessage={errorMessage(`Unexpected holder type ${publicKeyHolder.holder}!`)} />;
  }
}
