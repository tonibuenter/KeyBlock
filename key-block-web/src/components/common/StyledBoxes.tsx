import { withStyles } from 'tss-react/mui';
import { Box } from '@mui/material';
import { grey } from '@mui/material/colors';

export const PublicKeyBox = withStyles(Box, (theme) => ({
  root: {
    fontSize: '110%',
    fontWeight: '600',
    fontFamily: 'Courier',
    color: theme.palette.mode === 'dark' ? grey.A400 : grey.A700
  }
}));

export const DarkEnabledBox = withStyles(Box, (theme) => ({
  root: {
    color: theme.palette.mode === 'dark' ? grey.A400 : grey.A700
  }
}));
