import { ChangeEvent, useCallback, useState } from 'react';
import { Button, Stack, TextField } from '@mui/material';
import { Wallet } from 'alchemy-sdk';
import { StyledHead } from '../common/StyledHead';
import { dispatchSnackbarMessage } from '../../redux-support';
import { errorMessage } from '../../types';

export function Mnemonic2Keys() {
  const [mnemonicPhrase, setMnemonicPhrase] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [publicAddress, setPublicAddress] = useState('');

  const clear = useCallback(() => {
    setPrivateKey('');
    setPublicAddress('');
    setPublicKey('');
  }, []);

  return (
    <Stack spacing={2}>
      <StyledHead>Convert Mnemonic to Keys</StyledHead>
      <TextField
        size={'small'}
        label={'Mnemonic Phrase'}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setMnemonicPhrase(e.target.value)}
        value={mnemonicPhrase}
      />
      <Stack direction={'row'}>
        <Button
          key={'convert'}
          onClick={() => {
            try {
              const wallet = Wallet.fromMnemonic(mnemonicPhrase);
              setPrivateKey(wallet.privateKey);
              setPublicAddress(wallet.address);
              setPublicKey(wallet.publicKey);
            } catch (e) {
              dispatchSnackbarMessage(errorMessage('Did you provide 12 words from the Mnemonics?', e));
              clear();
            }
          }}
        >
          Convert To Private Key
        </Button>
        <Button key={'clear'} onClick={clear}>
          Clear
        </Button>
      </Stack>
      <TextField size={'small'} label={'Public Address'} value={publicAddress} />
      <TextField size={'small'} label={'Public Key'} value={publicKey} />
      <TextField size={'small'} label={'Private Key'} value={privateKey} />
    </Stack>
  );
}
