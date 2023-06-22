import * as React from 'react';
import { ChangeEvent, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { AddressBookEntry, errorMessage, infoMessage, isStatusMessage, NotifyFun, StatusMessage } from '../../types';
import { Autocomplete, Box, Stack } from '@mui/material';
import { dispatchLoading, useAddressBook, usePublicAddress, usePublicKeyHolder, useWeb3 } from '../../redux-support';
import { StatusMessageElement, nNonce } from '../utils';
import { displayAddress } from '../../utils/crypt-util';
import {
  encryptMessage,
  PrivateMessageStore_send,
  web3ContentHash
} from '../../contracts/private-message-store/PrivateMessageStore-support';
import { PublicKeyStore_get } from '../../contracts/public-key-store/PublicKeyStore-support';
import Web3 from 'web3';

const receiverDisplay = (e: AddressBookEntry): string => `${e.name} ${displayAddress(e.address)}`;

export function PrivateMessageNewUi({ done }: { done: NotifyFun }) {
  const web3 = useWeb3();
  const publicAddress = usePublicAddress();
  const { publicKey } = usePublicKeyHolder() || {};
  const addressBook = useAddressBook();
  const [receiverContent, setReceiverContent] = useState('');
  const [receiver, setReceiver] = useState('');
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');
  const [statusMessage, setStatusMessage] = useState<StatusMessage | undefined>();

  useEffect(() => {
    const index = addressBook.findIndex((e) => receiverDisplay(e) === receiverContent);
    setReceiver(index === -1 ? receiverContent : addressBook[index].address);
  }, [receiverContent, addressBook]);

  if (!web3 || !publicAddress || !publicKey) {
    console.error(`Web3, publicAddress or publicKey is missing. Can not open New Private Message!`);
    return <></>;
  }

  return (
    <Dialog open={true} onClose={done} fullWidth={true} maxWidth={'md'}>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline" spacing={2}>
          <Box>New OutMessage</Box>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={4}>
          <Autocomplete
            onChange={(e: any, newValue) => {
              setReceiverContent((newValue ?? '').toString());
            }}
            onInputChange={(event, newInputValue) => {
              setReceiverContent((newInputValue || '').toString());
            }}
            freeSolo
            options={addressBook.map((e) => receiverDisplay(e))}
            renderInput={(params) => (
              <TextField
                {...params}
                margin="dense"
                variant="standard"
                label="Receiver"
                helperText={
                  <Box component={'span'} sx={{ color: 'darkgreen', fontStyle: 'italic', fontWeight: '800' }}>
                    {receiver}
                  </Box>
                }
              />
            )}
          ></Autocomplete>

          <TextField
            key={'subject'}
            autoFocus
            margin="dense"
            value={subject}
            label="Subject"
            fullWidth
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)}
            variant="standard"
          />
          <TextField
            key={'text'}
            autoFocus
            margin="dense"
            value={text}
            label="OutMessage Text"
            fullWidth
            onChange={(e: ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
            variant="standard"
          />
          <StatusMessageElement statusMessage={statusMessage} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ height: '4em' }}>
          <StatusMessageElement statusMessage={statusMessage} onClose={() => setStatusMessage(undefined)} />
          <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
            <Button
              disabled={!subject || !text}
              onClick={() => {
                sendPrivateMessage({
                  web3,
                  publicAddress,
                  publicKey,
                  receiver,
                  subject,
                  text
                })
                  .catch(console.error)
                  .catch(console.error);
              }}
            >
              Send OutMessage
            </Button>

            <Button onClick={done}>Close</Button>
          </Stack>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export type SendPrivateMessageArgs = {
  web3: Web3;
  publicAddress: string;
  publicKey: string;
  receiver: string;
  subject: string;
  text: string;
};

export async function sendPrivateMessage({
  web3,
  publicAddress,
  publicKey,
  receiver,
  subject,
  text
}: SendPrivateMessageArgs) {
  if (publicAddress && web3 !== undefined && publicKey) {
    dispatchLoading('Encrypt Message...');
    //setStatusMessage(infoMessage('Saving... Please confirm/reject MetaMask dialog!'));
    try {
      const receiverPublicKey = await PublicKeyStore_get(web3, publicAddress, receiver);
      if (isStatusMessage(receiverPublicKey)) {
        return receiverPublicKey;
      }
      const nonce = nNonce();
      const outBox = await encryptMessage({
        web3,
        address: publicAddress,
        publicKey,
        subject,
        text,
        nonce
      });
      if (isStatusMessage(outBox)) {
        return outBox;
      }
      const inBox = await encryptMessage({
        web3,
        address: receiverPublicKey,
        publicKey: receiverPublicKey,
        subject,
        text,
        nonce
      });
      if (isStatusMessage(inBox)) {
        return inBox;
      }
      const contentHash = web3ContentHash(web3, subject, text);
      const res = await PrivateMessageStore_send(web3, publicAddress, {
        address: receiver,
        subjectInBox: inBox.subjectEnc,
        textInBox: inBox.textEnc,
        subjectOutBox: outBox.subjectEnc,
        textOutBox: outBox.textEnc,
        contentHash
      });
      if (isStatusMessage(res)) {
        return res;
      }
      return infoMessage(`OutMessage ${subject} successfully sent!`);
    } catch (e) {
      return errorMessage('Save not successful!', e);
    } finally {
      dispatchLoading('');
    }
  } else {
    return errorMessage('No read yet...!');
  }
}
