import { BoxKeyPair } from 'tweetnacl';
import { Box, Stack } from '@mui/material';
import { displayKey, u8ToHex } from '../../utils/nacl-util';
import Button from '@mui/material/Button';
import FileSaver from 'file-saver';

const SX = { fontFamily: 'Courier', fontSize: '80%', color: 'gray', cursor: 'pointer' };

export function KeyPairDisplay({ keyPair }: { keyPair: BoxKeyPair }) {
  return (
    <Stack sx={SX} direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={0.2}>
      <Box>Public: {displayKey(u8ToHex(keyPair.publicKey))}</Box>
      <Box>Secret: {displayKey(u8ToHex(keyPair.secretKey))}</Box>
      <Button
        size={'small'}
        fullWidth={false}
        onClick={() => {
          const text = JSON.stringify({
            publicKey: u8ToHex(keyPair.publicKey),
            secretKey: u8ToHex(keyPair.secretKey)
          });
          const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
          FileSaver.saveAs(blob, 'key-pair.json');
        }}
      >
        Download Key Pair
      </Button>
    </Stack>
  );
}
