import { withStyles } from 'tss-react/mui';
import { DarkEnabledBox } from './StyledBoxes';

export const StyledHead = withStyles(DarkEnabledBox, (theme) => ({
  root: {
    fontSize: '110%',
    fontWeight: '600'
  }
}));
