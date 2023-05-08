import * as React from 'react';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {
  EmptyItem,
  errorMessage,
  infoMessage,
  isStatusMessage,
  Item,
  NotifyFun,
  StatusMessage,
  warningMessage
} from '../types';
import { Box, Stack } from '@mui/material';
import { dispatchLoading, usePublicAddress, usePublicKey, useWeb3 } from '../redux-support';
import { StatusMessageElement } from './utils';
import moment from 'moment';
import { KeyBlock_add, KeyBlock_set } from '../contracts/KeyBlock-support';
import { orange } from '@mui/material/colors';
import { decryptContent, encryptContent } from '../utils/crypt-util';

type EditEntry = { value: string; enc: boolean; name: string };

export function KeyBlockEntry({
  open,
  item,
  done,
  update
}: {
  item: Item;
  open: boolean;
  done: NotifyFun;
  update: (e: Item) => void;
}) {
  const web3 = useWeb3();
  const publicAddress = usePublicAddress();
  const publicKey = usePublicKey();
  const [item0, setItem0] = useState<Item>(EmptyItem);
  const [statusMessage, setStatusMessage] = useState<StatusMessage | undefined>();
  const [dirty, setDirty] = useState(false);
  const [entry, setEntry] = useState<EditEntry>({
    value: '',
    enc: false,
    name: ''
  });

  const clearStatusMessageIn = useCallback((ms: number) => setTimeout(() => setStatusMessage(undefined), ms), []);

  useEffect(() => setItem0(item), [item]);
  useEffect(() => {
    setEntry({ enc: !!item.secret, value: item.secret, name: item.name });
    setDirty(false);
    setStatusMessage(undefined);
  }, [item]);

  if (!web3 || !publicAddress) {
    return <></>;
  }

  return (
    <Dialog open={open} onClose={done} fullWidth={true} maxWidth={'md'}>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline" spacing={2}>
          <Box>Edit KeyBlock Item{dirty ? '*' : ''}</Box>
          <Box>{item0.index === -1 ? '' : `Inserted: ${item0.inserted}`}</Box>
          <Box sx={{ color: orange.A400 }}>{item0.index === -1 ? 'New' : `Index: ${item0.index}`}</Box>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={4}>
          <DialogContentText>You can edit change the name and the secret.</DialogContentText>{' '}
          {item0.inserted ? (
            <Box>
              index: {item0.index} - inserted: {item0.inserted}
            </Box>
          ) : (
            <></>
          )}
          <TextField
            key={'name'}
            autoFocus
            margin="dense"
            value={entry.name || ''}
            label="Name"
            fullWidth
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setEntry((i) => ({ ...i, name: e.target.value }));
              setDirty(true);
            }}
            variant="standard"
          />
          <TextField
            key={'secret-open'}
            disabled={entry.enc}
            autoFocus
            margin="dense"
            label={entry.enc ? `Value (encrypted size:${entry.value.length})` : 'Value (plain text)'}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setEntry((i) => {
                return {
                  ...i,
                  value: e.target.value,
                  enc: false
                };
              });
              setDirty(true);
            }}
            value={entry.value}
            fullWidth
            variant="standard"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ height: '4em' }}>
          <StatusMessageElement statusMessage={statusMessage} onClose={() => setStatusMessage(undefined)} />
          <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
            <Button
              disabled={!entry.value || !entry.enc}
              onClick={async () => {
                if (publicAddress) {
                  try {
                    dispatchLoading('Decryption processing...');
                    setStatusMessage(warningMessage('Please confirm/reject MetaMask dialog!'));
                    const s0: any = await decryptContent(publicAddress, entry.value);
                    setEntry((i) => ({ ...i, enc: false, value: s0.value }));
                    setStatusMessage(infoMessage('Decryption done successfully'));
                    clearStatusMessageIn(2000);
                  } catch (e) {
                    setStatusMessage(errorMessage('Could not decrypt message!', (e as Error).message));
                    clearStatusMessageIn(5000);
                  } finally {
                    dispatchLoading('');
                  }
                }
              }}
            >
              Decrypt
            </Button>
            <Button
              disabled={entry.enc || !entry.value}
              onClick={() => {
                if (publicKey) {
                  const s0 = encryptContent(publicKey, { value: entry.value, nonce: 'n' + Math.random() });
                  setEntry((i) => ({ ...i, enc: true, value: s0 }));
                  setStatusMessage(infoMessage('Encryption done successfully'));
                  clearStatusMessageIn(1000);
                } else {
                  setStatusMessage(errorMessage('No public key available! Can not encrypt!'));
                }
              }}
            >
              Encrypt
            </Button>
            <Button
              disabled={!(entry.enc && entry.value && dirty)}
              onClick={async () => {
                dispatchLoading('Saving BlockEntry...');
                setStatusMessage(infoMessage('Saving... Please confirm/reject MetaMask dialog!'));
                try {
                  if (item0.index === -1) {
                    const res = await KeyBlock_add(web3, publicAddress, entry.name, entry.value);
                    if (isStatusMessage(res)) {
                      setStatusMessage(res);
                      return;
                    }
                  } else {
                    const res = await KeyBlock_set(web3, publicAddress, item0.index, entry.name, entry.value);
                    if (isStatusMessage(res)) {
                      setStatusMessage(res);
                      return;
                    }
                  }
                  const e: Item = {
                    index: item0.index,
                    name: entry.name,
                    secret: entry.value,
                    inserted: moment().format('YYYY-MM-DD HH:mm')
                  };
                  update(e);
                  done();
                } catch (e) {
                  setStatusMessage(errorMessage('Save not successful!', e));
                } finally {
                  dispatchLoading('');
                }
                setDirty(false);
              }}
            >
              Save
            </Button>
            <Button
              onClick={() => {
                done();
              }}
            >
              Close
            </Button>
          </Stack>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
