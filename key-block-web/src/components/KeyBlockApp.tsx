import { useNetworkId, usePublicAddress } from '../redux-support';
import Login from './Login';
import KeyBlockTableUi from './KeyBlockTableUi';
import { AppBar, Box, Container, IconButton, Stack, Toolbar, useTheme } from '@mui/material';

import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { ColorModeContext } from '../App';
import { useContext } from 'react';
import { DynStatusMessageElement } from './utils';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import KeyIcon from '@mui/icons-material/Key';
import { green } from '@mui/material/colors';
import Loader from './Loader';
import { displayAddress } from '../utils/crypt-util';
import logo from '../images/keyblock200.png';
import { networkIdToName } from './Web3InfoPage';

export function KeyBlockApp() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  const publicAddress = usePublicAddress();
  const networkId = useNetworkId();

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
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: theme.palette.mode === 'dark' ? 'ffaf00' : 'black',
          color: theme.palette.mode === 'dark' ? 'gray' : undefined
        }}
      >
        <Toolbar variant="regular">
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ width: '100%' }}>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={0.5}
              sx={{ fontWeight: 'bold', fontSize: '120%' }}
            >
              <img src={logo} alt={'KeyBlock'} style={{ maxHeight: '1.2em' }} />
              <Box>Welcome to KeyBlock</Box>
            </Stack>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={0.5}
              sx={{ fontSize: '100%', color: publicAddress ? green[200] : 'white', fontWeight: 'bold' }}
            >
              {publicAddress ? <LinkIcon /> : <LinkOffIcon />}
              <Box>{publicAddress ? displayAddress(publicAddress) : 'not connected'}</Box>
              <Box>{networkId ? networkIdToName(networkId) : ''}</Box>
            </Stack>
            <IconButton style={{ float: 'right' }} onClick={colorMode.toggleColorMode} color="inherit">
              {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>
      <Container key={'app-menu'} maxWidth={false}>
        <Stack spacing={2}>
          <DynStatusMessageElement />
          {publicAddress ? <KeyBlockTableUi /> : <Login />}
        </Stack>
        <Loader />
      </Container>
    </Box>
  );
}
