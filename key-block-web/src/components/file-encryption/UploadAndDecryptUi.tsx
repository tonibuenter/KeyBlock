import * as React from 'react';
import { useState } from 'react';
import { errorMessage, StatusMessage } from '../../types';
import { Box, Divider, Grid, Stack, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { FileUploader } from 'react-drag-drop-files';
import { StyledHead } from '../common/StyledHead';
import { BoxKeyPair } from 'tweetnacl';
import { hexToU8 } from '../../utils/nacl-util';
import { KeyPairDisplay } from '../common/KeyPairDisplay';
import { StatusMessageElement } from '../utils';
import { decryptFile } from './UploadAndEncryptUi';

export function UploadAndDecryptUi() {
  const [keyPairText, setKeyPairText] = useState<string>();
  const [keyPairError, setKeyPairError] = useState<StatusMessage>();

  const [keyPair, setKeyPair] = useState<BoxKeyPair>();
  const [uploadedFile, setUploadedFile] = useState<File>();

  return (
    <Stack spacing={2}>
      <StyledHead>{'Encrypt and Download'}</StyledHead>

      <Grid key={'main'} container justifyContent="flex-start" alignItems="center" spacing={6}>
        <Grid key={'key-pair-label'} item sm={2}>
          <Box sx={{ fontWeight: 600 }}>1 : Provide Key Pair</Box>
        </Grid>
        <Grid key={'key-pair'} item sm={9}>
          <TextField value={keyPairText} fullWidth onChange={(e) => setKeyPairText(e.target.value)}></TextField>
          {!keyPair ? (
            <Button
              key={'create-key-pair'}
              disabled={!keyPairText}
              onClick={() => {
                if (keyPairText) {
                  try {
                    const kp = JSON.parse(keyPairText);
                    const kp1: BoxKeyPair = { secretKey: hexToU8(kp.secretKey), publicKey: hexToU8(kp.publicKey) };
                    setKeyPair(kp1);
                    setKeyPairError(undefined);
                  } catch (e) {
                    setKeyPairError(errorMessage('Error in creating the Key Pair!'));
                  }
                }
              }}
            >
              Create Key Pair
            </Button>
          ) : !!keyPairError ? (
            <StatusMessageElement statusMessage={keyPairError} />
          ) : (
            <KeyPairDisplay keyPair={keyPair} />
          )}
        </Grid>

        <Grid key={'public-address-label'} item sm={2}>
          <Box sx={{ fontWeight: 600 }}>2: Upload your encrypted file</Box>
        </Grid>
        <Grid key={'public-address'} item sm={9}>
          {uploadedFile ? (
            <Box>{uploadedFile.name}</Box>
          ) : (
            <FileUploader
              handleChange={(file: File) => {
                setUploadedFile(file);
              }}
              name="file"
            ></FileUploader>
          )}
        </Grid>
      </Grid>

      <Divider key={'find-divider'} />

      <Grid key={'process'} container justifyContent="flex-start" alignItems="center" spacing={6}>
        <Grid key={'buttons'} item sm={9}>
          <Button
            key={'decrypt-and-download'}
            disabled={!uploadedFile || !keyPair}
            onClick={async () => {
              if (keyPair && uploadedFile) {
                const arrayBuffer = await uploadedFile.arrayBuffer();
                const encryptedContent = new Uint8Array(arrayBuffer);
                decryptFile(encryptedContent, keyPair, uploadedFile);
              }
            }}
          >
            Decrypt and Download
          </Button>
          <Button
            key={'clean'}
            disabled={!(uploadedFile || keyPair)}
            onClick={async () => {
              setUploadedFile(undefined);
              setKeyPair(undefined);
              setKeyPairText('');
            }}
          >
            Clear all data
          </Button>
        </Grid>
      </Grid>
    </Stack>
  );
}
