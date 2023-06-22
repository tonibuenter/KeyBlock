import {withStyles} from 'tss-react/mui';
import {Button, ListItemText} from '@mui/material';

export const ButtonRegular = withStyles(Button, {root: {textTransform: 'none'}});
export const ButtonItalic = withStyles(Button, {root: {fontStyle: 'italic', textTransform: 'none'}});

export const ButtonBold = withStyles(Button, {
  root: {fontStyle: 'italic', textTransform: 'none', fontWeight: 'bold'},
  text: {fontWeight: 'bold'}
});


export const StyledListItemText = withStyles(ListItemText, (theme) => ({
  root: {color: '#2196f3', fontWeight: '800 !important'}
}));
