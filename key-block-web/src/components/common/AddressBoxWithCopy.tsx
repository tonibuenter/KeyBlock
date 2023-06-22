import { IconButton, Stack } from '@mui/material';
import { dispatchSnackbarMessage } from '../../redux-support';
import { infoMessage } from '../../types';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import * as React from 'react';
import { PublicKeyBox } from './StyledBoxes';

export function AddressBoxWithCopy({ value }: { value: string }) {
  return (
    <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={0.6}>
      <PublicKeyBox>{value}</PublicKeyBox>
      <IconButton
        sx={{ display: !value ? 'none' : undefined }}
        aria-label="copy value to clipboard"
        onClick={() => {
          dispatchSnackbarMessage(infoMessage(`${value} copied to clipboard!`));
          navigator.clipboard.writeText(value).catch(console.error);
        }}
        edge="end"
      >
        <ContentCopyIcon></ContentCopyIcon>
      </IconButton>
    </Stack>
  );
}
