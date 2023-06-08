import * as React from 'react';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { errorMessage, infoMessage, isStatusMessage, NotifyFun, StatusMessage } from '../../types';
import { Autocomplete, Box, Stack } from '@mui/material';
import { dispatchLoading, usePublicAddress, usePublicKeyHolder, useWeb3 } from '../../redux-support';
import { StatusMessageElement } from '../utils';
import { displayAddress, encryptContent } from '../../utils/crypt-util';
import { PrivateMessageStore_send } from '../../contracts/private-message-store/PrivateMessageStore-support';

type AddressBookEntry = { address: string; name: string };

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

const receiverDisplay = (e: AddressBookEntry): string => `${e.name} ${displayAddress(e.address)}`;

export function PrivateMessageNewUi({ done }: { done: NotifyFun }) {
  const web3 = useWeb3();
  const publicAddress = usePublicAddress();
  const publicKeyHolder = usePublicKeyHolder();
  const [receiverContent, setReceiverContent] = useState('');
  const [receiver, setReceiver] = useState('');
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');
  const [statusMessage, setStatusMessage] = useState<StatusMessage | undefined>();

  useEffect(() => {
    const index = addressBook.findIndex((e) => receiverDisplay(e) === receiverContent);
    console.debug('index ', index, 'receiverContent', receiverContent, 'element 1', addressBook[1].name);
    setReceiver(index === -1 ? receiverContent : addressBook[index].address);
  }, [receiverContent]);

  const sendPrivateMessage = useCallback(
    async (receiver: string, subject: string, text: string) => {
      if (publicAddress && web3 && publicKeyHolder?.publicKey) {
        dispatchLoading('Sending Private Message...');
        setStatusMessage(infoMessage('Saving... Please confirm/reject MetaMask dialog!'));
        try {
          const receiverPublicKey = '';
          const subjectInBox = encryptContent(receiverPublicKey, subject);
          const textInBox = encryptContent(receiverPublicKey, text);
          const subjectOutBox = encryptContent(publicKeyHolder?.publicKey, subject);
          const textOutBox = encryptContent(publicKeyHolder?.publicKey, text);
          const contentHash = web3.utils.keccak256(subject + '-' + text);
          const res = await PrivateMessageStore_send(web3, publicAddress, {
            address: receiver,
            subjectInBox,
            textInBox,
            subjectOutBox,
            textOutBox,
            contentHash
          });
          if (isStatusMessage(res)) {
            setStatusMessage(res);
            return;
          }
        } catch (e) {
          setStatusMessage(errorMessage('Save not successful!', e));
        } finally {
          dispatchLoading('');
        }
      }
    },
    [web3, publicAddress, publicKeyHolder]
  );

  if (!web3 || !publicAddress) {
    return <></>;
  }

  return (
    <Dialog open={true} onClose={done} fullWidth={true} maxWidth={'md'}>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline" spacing={2}>
          <Box>New Message</Box>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={4}>
          <Autocomplete
            onChange={(e: any, newValue) => {
              console.debug(e.target.value, 'new value', newValue);
              setReceiverContent((newValue || '').toString());
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
            label="Message Text"
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
                sendPrivateMessage(receiver, subject, text);
              }}
            >
              Send Message
            </Button>

            <Button onClick={done}>Close</Button>
          </Stack>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
