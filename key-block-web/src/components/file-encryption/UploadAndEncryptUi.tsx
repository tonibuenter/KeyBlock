import * as React from 'react';
import { useState } from 'react';
import { errorMessage } from '../../types';
import { Box, Divider, Grid, Stack } from '@mui/material';
import { dispatchSnackbarMessage } from '../../redux-support';
import Button from '@mui/material/Button';
import { FileUploader } from 'react-drag-drop-files';
import { StyledHead } from '../common/StyledHead';
import nacl, { box, BoxKeyPair } from 'tweetnacl';
import { saveAs } from 'file-saver';
import { newNonce } from '../../utils/nacl-util';
import { KeyPairDisplay } from '../common/KeyPairDisplay';

export function UploadAndEncryptUi() {
  const [encryptedContent, setEncryptedContent] = useState<Uint8Array>();
  const [keyPair, setKeyPair] = useState<BoxKeyPair>();
  const [uploadedFile, setUploadedFile] = useState<File>();

  return (
    <Stack spacing={2}>
      <StyledHead>{'Encrypt and Download'}</StyledHead>

      <Grid key={'main'} container justifyContent="flex-start" alignItems="center" spacing={6}>
        <Grid key={'key-pair-label'} item sm={2}>
          <Box sx={{ fontWeight: 600 }}>1 : Create Key Pair</Box>
        </Grid>
        <Grid key={'key-pair'} item sm={9}>
          {!keyPair ? (
            <Button
              key={'create-key-pair'}
              disabled={!!keyPair}
              onClick={() => {
                setKeyPair(nacl.box.keyPair());
              }}
            >
              Create Key Pair
            </Button>
          ) : (
            <KeyPairDisplay keyPair={keyPair} />
          )}
        </Grid>

        <Grid key={'public-address-label'} item sm={2}>
          <Box sx={{ fontWeight: 600 }}>2: Upload your file</Box>
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
            key={'encrypt-and-download'}
            disabled={!uploadedFile || !keyPair}
            onClick={async () => {
              if (uploadedFile && keyPair) {
                const { secretKey, publicKey } = keyPair;
                const arrayBuffer = await uploadedFile.arrayBuffer();
                const data = new Uint8Array(arrayBuffer);
                const nonce = newNonce();
                const encrypted = nacl.box(data, nonce, publicKey, secretKey);
                if (!encrypted) {
                  dispatchSnackbarMessage(errorMessage(`Could not encrypt the ${uploadedFile.name}!`));
                } else {
                  const fullEncrypted = new Uint8Array(nonce.length + encrypted.length);
                  fullEncrypted.set(nonce);
                  fullEncrypted.set(encrypted, nonce.length);
                  setEncryptedContent(fullEncrypted);
                  const blob = new Blob([fullEncrypted], { type: 'application/octed' });
                  saveAs(blob, `encrypted-${uploadedFile.name}`);
                }
              }
            }}
          >
            Encrypt
          </Button>

          <Button
            key={'decrypt-and-download'}
            disabled={!encryptedContent || !uploadedFile || !keyPair}
            onClick={async () => {
              if (encryptedContent && keyPair && uploadedFile) {
                decryptFile(encryptedContent, keyPair, uploadedFile);
              }
            }}
          >
            Decrypt
          </Button>
          <Button
            key={'clean'}
            disabled={!(uploadedFile || keyPair || encryptedContent)}
            onClick={async () => {
              setUploadedFile(undefined);
              setEncryptedContent(undefined);
              setKeyPair(undefined);
            }}
          >
            Clear all data
          </Button>
        </Grid>
      </Grid>
    </Stack>
  );
}

export async function decryptFile(encryptedContent: Uint8Array, keyPair: BoxKeyPair, uploadedFile: File) {
  const nonce = encryptedContent.subarray(0, box.nonceLength);
  const encContent = encryptedContent.subarray(box.nonceLength, encryptedContent.length);
  const decryptedContent = nacl.box.open(encContent, nonce, keyPair.publicKey, keyPair.secretKey);
  if (!decryptedContent) {
    dispatchSnackbarMessage(errorMessage(`Could not decrypt the ${uploadedFile.name}!`));
    return;
  } else {
    const blob = new Blob([decryptedContent], { type: 'application/octed' });
    saveAs(blob, `decrypted-${uploadedFile.name}`);
  }
}
