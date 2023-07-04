import * as React from 'react';
import { useCallback } from 'react';
import { warningMessage } from '../../types';
import { Box, Divider, Paper, Stack } from '@mui/material';
import { usePublicAddress, useWeb3 } from '../../redux-support';
import { StatusMessageElement } from '../utils';
import ReactMarkdown from 'react-markdown';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { UploadAndEncryptUi } from './UploadAndEncryptUi';
import { UploadAndDecryptUi } from './UploadAndDecryptUi';

export function FileEncryptionUi() {
  const web3 = useWeb3();
  const publicAddress = usePublicAddress();

  const [value, setValue] = React.useState(0);
  const handleChange = useCallback((event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  }, []);

  if (!publicAddress) {
    return <StatusMessageElement statusMessage={warningMessage(`No public address available!`)} />;
  }
  if (!web3) {
    return <StatusMessageElement statusMessage={warningMessage('Web3 is not initialized!')} />;
  }

  return (
    <Stack spacing={2}>
      <ReactMarkdown>{`
# File Encryption

Here you can do some file encryption:

You can:

- *Upload & encrypt*: Upload file, encrypt and download the file and the keys.
- *Upload & decrypt*: Upload file and keys and download the unencrypted file.

All processing is done locally on your computer not data is uploaded to any site!
    
`}</ReactMarkdown>

      <Divider key={'my-stuff-divider'} />

      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Encryption" />
            <Tab label="Decryption" />
          </Tabs>
        </Box>
        <Paper sx={{ margin: '1em 0 1em 0' }}>
          {value === 0 && <UploadAndEncryptUi />}
          {value === 1 && <UploadAndDecryptUi />}
        </Paper>
      </Box>
    </Stack>
  );
}
