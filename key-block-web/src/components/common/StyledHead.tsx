import { withStyles } from 'tss-react/mui';
import { Box } from '@mui/material';
import { grey } from '@mui/material/colors';
import { DarkEnabledBox } from './StyledBoxes';

export const StyledHead = withStyles(DarkEnabledBox, (theme) => ({
  root: {
    fontSize: '110%',
    fontWeight: '600'
  }
}));
