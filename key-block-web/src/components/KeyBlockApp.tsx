import { usePublicAddress } from '../redux-support';
import Login from './Login';
import KeyBlockTableUi from './KeyBlockTableUi';
import { Box, Container, Stack } from '@mui/material';
import { DynStatusMessageElement } from './utils';
import Loader from './Loader';
import { AppHeader } from './AppHeader';

export function KeyBlockApp() {
  const publicAddress = usePublicAddress();

  return (
    <Box
      sx={{
        display: 'block',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        boxSizing: 'border-box',
        p: 0
      }}
    >
      <AppHeader />

      <Box mt={'1em'} mb={'1em'}>
        <DynStatusMessageElement />
      </Box>

      <Container key={'app-menu'} maxWidth={false}>
        <Stack spacing={2} mt={'1em'} mb={'1em'}>
          {publicAddress ? <KeyBlockTableUi /> : <Login />}
        </Stack>
        <Loader />
      </Container>
    </Box>
  );
}
