import { AppBar, Box, Button, IconButton, Stack, Toolbar, useTheme } from '@mui/material';
import logo from '../images/keyblock200.png';
import { green } from '@mui/material/colors';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import { displayAddress } from '../utils/crypt-util';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { useContext, useState } from 'react';
import { ColorModeContext } from '../App';
import { useNetworkId, usePublicAddress } from '../redux-support';
import { useLocation, useNavigate } from 'react-router-dom';
import { menuDefs } from './menu';
import { getNetworkInfo } from '../contracts/network-info';
import { Web3InfoPage } from './Web3InfoPage';

export function AppHeader() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const publicAddress = usePublicAddress();
  const networkId = useNetworkId();
  const [openInfoPage, setOpenInfoPage] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { name } = getNetworkInfo(networkId);
  return (
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
            onClick={() => navigate('/menu')}
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={0.5}
            sx={{ fontWeight: 'bold', fontSize: '120%', cursor: 'pointer' }}
          >
            <img src={logo} alt={'KeyBlock'} style={{ maxHeight: '1.2em' }} />
            <Box>{title(location.pathname)}</Box>
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

          <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.5}>
            <Button onClick={() => setOpenInfoPage(true)}>{name}</Button>
          </Stack>

          <IconButton style={{ float: 'right' }} onClick={colorMode.toggleColorMode} color="inherit">
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Stack>
      </Toolbar>
      <Web3InfoPage open={openInfoPage} done={() => setOpenInfoPage(false)}></Web3InfoPage>
    </AppBar>
  );
}

function title(path: string) {
  return menuDefs.find((def) => '/' + def.path === path)?.name || 'Menu';
}
