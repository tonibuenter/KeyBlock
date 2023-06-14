import * as React from 'react';
import { ChangeEvent, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { errorMessage, infoMessage, isStatusMessage, NotifyFun, StatusMessage } from '../../types';
import { Box, Paper, Stack } from '@mui/material';
import { dispatchLoading, usePublicAddress, usePublicKeyHolder, useWeb3 } from '../../redux-support';
import { StatusMessageElement, web3Nonce } from '../utils';
import {
  encryptMessage,
  PrivateMessageStore_reply,
  web3ContentHash
} from '../../contracts/private-message-store/PrivateMessageStore-support';
import { PublicKeyStore_get } from '../../contracts/public-key-store/PublicKeyStore-support';
import { Message } from './PrivateMessageStoreUi';
import { AddressDisplayWithAddressBook } from './AddressDisplayWithAddressBook';
import Web3 from 'web3';

export function PrivateMessageReplyUi({ messageToReply, done }: { messageToReply: Message; done: NotifyFun }) {
  const web3 = useWeb3();
  const publicAddress = usePublicAddress();
  const { publicKey } = usePublicKeyHolder() || {};
  const [subject, setSubject] = useState('Re:' + messageToReply.subject);
  const [text, setText] = useState('');
  const [statusMessage, setStatusMessage] = useState<StatusMessage | undefined>();

  if (!web3 || !publicAddress || !publicKey) {
    console.error(`Web3, publicAddress or publicKey is missing. Can not open Private Message Reply!`);
    return <></>;
  }

  return (
    <Dialog open={true} onClose={done} fullWidth={true} maxWidth={'md'}>
      <DialogTitle>
        <Stack justifyContent="space-between" alignItems="baseline" spacing={2}>
          <Box key={'title'}>Reply to Message</Box>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={4}>
          <Paper variant={'outlined'} square={true} sx={{ padding: '1em' }}>
            <Stack spacing={2}>
              <Box key={'subject-disp'} sx={{ fontWeight: 600 }}>
                {messageToReply.subject}
              </Box>
              <Box key={'subject'}>{messageToReply.text}</Box>
            </Stack>
          </Paper>
          <Box key={'to'}>
            Reply to:
            <AddressDisplayWithAddressBook address={messageToReply.sender} />
          </Box>
          <TextField
            key={'reply-subject'}
            autoFocus
            margin="dense"
            value={subject}
            label="Reply Subject"
            fullWidth
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)}
            variant="standard"
          />
          <TextField
            key={'reply-text'}
            autoFocus
            margin="dense"
            value={text}
            label="Reply Text"
            fullWidth
            onChange={(e: ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
            variant="standard"
            multiline
          />
          <StatusMessageElement statusMessage={statusMessage} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ height: '4em' }}>
          <StatusMessageElement statusMessage={statusMessage} onClose={() => setStatusMessage(undefined)} />
          <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
            <Button
              key={'send-reply'}
              disabled={!subject || !text}
              onClick={() => {
                replyPrivateMessage({
                  web3,
                  publicAddress,
                  publicKey,
                  receiver: messageToReply.sender,
                  subject,
                  text,
                  replyIndex: messageToReply.index
                }).catch(console.error);
              }}
            >
              Send Reply
            </Button>

            <Button key={'close'} onClick={done}>
              Close
            </Button>
          </Stack>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export type ReplyPrivateMessageArgs = {
  web3: Web3;
  publicAddress: string;
  publicKey: string;
  receiver: string;
  subject: string;
  text: string;
  replyIndex: number;
};

export async function replyPrivateMessage({
  web3,
  publicAddress,
  publicKey,
  receiver,
  subject,
  text,
  replyIndex
}: ReplyPrivateMessageArgs): Promise<StatusMessage> {
  if (publicAddress && web3 !== undefined && publicKey) {
    dispatchLoading('Encrypt Message...');
    //setStatusMessage(infoMessage('Saving... Please confirm/reject MetaMask dialog!'));
    try {
      const receiverPublicKey = await PublicKeyStore_get(web3, publicAddress, receiver);
      if (isStatusMessage(receiverPublicKey)) {
        return receiverPublicKey;
      }
      const nonce = await web3Nonce(web3, publicAddress);
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
      const res = await PrivateMessageStore_reply(web3, publicAddress, {
        address: receiver,
        replySubjectInBox: inBox.subjectEnc,
        replyTextInBox: inBox.textEnc,
        replySubjectOutBox: outBox.subjectEnc,
        replyTextOutBox: outBox.textEnc,
        contentHash,
        replyIndex
      });
      if (isStatusMessage(res)) {
        return res;
      }
      return infoMessage(`Message ${subject} successfully sent!`);
    } catch (e) {
      return errorMessage('Save not successful!', e);
    } finally {
      dispatchLoading('');
    }
  } else {
    return errorMessage('No read yet...!');
  }
}
