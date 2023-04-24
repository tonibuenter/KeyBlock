import { usePublicAddress } from '../redux-support';
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

export function KeyBlockApp() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

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
      <AppBar
        position="static"
        elevation={0}
        sx={{ background: 'black', color: theme.palette.mode === 'dark' ? 'lightGray' : undefined }}
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
              <KeyIcon fontSize={'large'} />
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
