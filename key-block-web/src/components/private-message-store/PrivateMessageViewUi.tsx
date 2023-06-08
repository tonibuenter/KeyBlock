import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Stack } from '@mui/material';
import { usePublicAddress, useWeb3 } from '../../redux-support';
import { GetInBoxResult } from '../../contracts/private-message-store/PrivateMessageStore-support';
import { NotifyFun } from '../../types';

export function PrivateMessageViewUi({ done, message }: { done: NotifyFun; message: GetInBoxResult }) {
  const web3 = useWeb3();
  const publicAddress = usePublicAddress();

  if (!web3 || !publicAddress) {
    return <></>;
  }

  return (
    <Dialog open={true} onClose={done} fullWidth={true} maxWidth={'md'}>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline" spacing={2}>
          <Box>Message</Box>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={4}>
          <DialogContentText>Message {message.index}</DialogContentText>

          <Box key={'subject'}>{message.subjectInBox}</Box>
          <Box key={'subject'}>{message.subjectInBox}</Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ height: '4em' }}>
          <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
            <Button onClick={done}>Close</Button>
          </Stack>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
