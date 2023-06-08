import * as React from 'react';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { infoMessage, isStatusMessage, StatusMessage } from '../../types';
import { Box, Divider, IconButton, InputAdornment, OutlinedInput, Stack } from '@mui/material';
import {
  dispatchStatusMessage,
  useNetworkId,
  usePublicAddress,
  usePublicKeyHolder,
  useWeb3
} from '../../redux-support';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
  PublicKeyStore_get,
  PublicKeyStore_getMine,
  PublicKeyStore_set
} from '../../contracts/public-key-store/PublicKeyStore-support';
import { StatusMessageElement } from '../utils';
import { getBlockchainByNetworkId } from '../Web3InfoPage';
import { wrapPromise } from '../../utils';

export function PublicKeyStoreUi() {
  const web3 = useWeb3();
  const publicAddress = usePublicAddress();
  const publicKeyHolder = usePublicKeyHolder();
  const [myPublicKey, setMyPublicKey] = useState('');
  const [address0, setAddress0] = useState('');
  const [publicKey0, setPublicKey0] = useState('');
  const [statusMessage, setStatusMessage] = useState<StatusMessage | undefined>();
  const networkId = useNetworkId();

  const networkName = networkId ? getBlockchainByNetworkId(networkId) : '';

  const getMine = useCallback(async () => {
    if (!web3 || !publicAddress) {
      return;
    }
    const myPublicKey0 = await wrapPromise(PublicKeyStore_getMine(web3, publicAddress), 'Reading my Public Key...');
    if (isStatusMessage(myPublicKey0)) {
      setStatusMessage(myPublicKey0);
    } else if (!myPublicKey0) {
      setStatusMessage(infoMessage(`My Public Key is not yet save on: ${networkName}`));
      setMyPublicKey('');
    } else {
      setMyPublicKey(myPublicKey0);
    }
  }, [web3, publicAddress, networkName]);

  const saveMine = useCallback(async () => {
    if (!web3 || !publicAddress || !publicKeyHolder) {
      return;
    }
    const myPublicKey0 = await wrapPromise(
      PublicKeyStore_set(web3, publicAddress, publicKeyHolder.publicKey),
      'Writing Public Key. (Checkout Meta Mask!)'
    );
    if (isStatusMessage(myPublicKey0)) {
      setStatusMessage(myPublicKey0);
    } else {
      setMyPublicKey(myPublicKey0);
    }
  }, [web3, publicAddress, publicKeyHolder]);

  const getPublicKey = useCallback(async () => {
    if (!web3 || !publicAddress || !address0) {
      return;
    }
    const publicKey0 = await wrapPromise(
      PublicKeyStore_get(web3, address0, publicAddress),
      `Reading Public Key for ${address0}`
    );
    if (isStatusMessage(publicKey0)) {
      setStatusMessage(publicKey0);
    } else {
      setPublicKey0(publicKey0);
    }
  }, [web3, publicAddress, address0]);

  useEffect(() => {
    getMine().catch(console.error);
  }, [getMine]);

  return (
    <Stack spacing={2}>
      <StatusMessageElement statusMessage={statusMessage} onClose={() => setStatusMessage(undefined)} />
      <h3>
        <Box>My Public Key on: {networkName}</Box>
      </h3>
      <TextField
        key={'my-public-key'}
        disabled={true}
        margin="dense"
        label={'My Public Key'}
        value={publicKeyHolder?.publicKey || ''}
        fullWidth
        variant="standard"
      />

      <Stack direction={'row'} spacing={1}>
        <Button onClick={getMine}>Refresh</Button>
        <Button disabled={!!myPublicKey || !publicKeyHolder} onClick={saveMine}>
          Save my public key
        </Button>
      </Stack>
      <TextFieldWithCopy key={'my-public-key-on'} label={`My Public Key on ${networkName}`} value={myPublicKey} />
      <Divider></Divider>
      <h3>{`Read a Public Key from ${networkName}`}</h3>
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
        <Button disabled={!address0} onClick={getPublicKey}>
          Get Public Key
        </Button>
      </Stack>
      <TextFieldWithCopy label={`Public key from ${networkName}`} value={publicKey0}></TextFieldWithCopy>
    </Stack>
  );
}

function TextFieldWithCopy({ label, value }: { label: string; value: string }) {
  return (
    <OutlinedInput
      disabled={true}
      margin="dense"
      label={label}
      value={value}
      fullWidth
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            aria-label="copy value to clipboard"
            onClick={() => {
              dispatchStatusMessage(infoMessage('Value copied to clipboard!'));
              navigator.clipboard.writeText(value).catch(console.error);
            }}
            edge="end"
          >
            <ContentCopyIcon></ContentCopyIcon>
          </IconButton>
        </InputAdornment>
      }
    />
  );
}
