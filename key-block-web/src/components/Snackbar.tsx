import { SnackbarKey, SnackbarProvider, useSnackbar } from 'notistack';
import { useSnackbarMessage } from '../redux-support';
import * as React from 'react';
import { useCallback, useEffect } from 'react';
import { IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

export const Snackbar = () => (
  <SnackbarProvider maxSnack={4} autoHideDuration={5000}>
    <Snackeater />
  </SnackbarProvider>
);

let lastSnack = -1;

function Snackeater() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const snackbarMessage = useSnackbarMessage();

  const action = useCallback(
    (snackbarId: SnackbarKey) => (
      <IconButton
        onClick={() => {
          closeSnackbar(snackbarId);
        }}
      >
        <ClearIcon sx={{ color: 'white' }} />
      </IconButton>
    ),
    [closeSnackbar]
  );

  useEffect(() => {
    if (snackbarMessage && snackbarMessage.counter > lastSnack && snackbarMessage.userMessage) {
      lastSnack = snackbarMessage.counter;
      const variant = snackbarMessage.status;
      enqueueSnackbar(snackbarMessage.userMessage, { action, variant });
    }
  }, [snackbarMessage, enqueueSnackbar, action]);
  return <></>;
}
