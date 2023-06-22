import {Container, ListItem, ListItemButton, Tooltip} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {usePublicKeyHolder} from '../redux-support';
import List from '@mui/material/List';
import {StyledListItemText} from "./common/StyledButtons";

export type MenuDef = { path: string; name: string; description: string };

export const menuDefs: MenuDef[] = [{
  path: '/key-block',
  name: 'My Secret Store',
  description: 'Save your passwords in the most possible safe and secure way.'
},
  {
    path: '/public-key-store',
    name: 'Public Key Store',
    description: 'Provide your public key for others to send you encrypted data.'
  },
  {
    path: '/private-message-store',
    name: 'Save Message Store',
    description: 'Send and receive encrypted messages.'
  },]


export function AppMenu() {
  const navigate = useNavigate();

  const publicKeyHolder = usePublicKeyHolder();


  return (
      <Container maxWidth="sm">
        {/*<ButtonBold onClick={() => navigate('/login')}>*/}
        {/*  Login &nbsp;{' '}*/}
        {/*  {!!publicKeyHolder ? <CheckCircleIcon color={'success'}/> : <RadioButtonUncheckedIcon color={'warning'}/>}*/}
        {/*</ButtonBold>*/}
        {/*<Tooltip title={'Save your passwords in the most possible safe and secure way!'}>*/}
        {/*  <ButtonBold onClick={() => navigate('/key-block')}>Key Block</ButtonBold>*/}
        {/*</Tooltip>*/}
        {/*<Tooltip title={'Provide your public key for others to send you encrypted data, including messages.'}>*/}
        {/*  <ButtonBold onClick={() => navigate('/public-key-store')}>Public Key Store</ButtonBold>*/}
        {/*</Tooltip>*/}
        {/*<Tooltip title={'Send and receive encrypted messages!'}>*/}
        {/*<span>*/}
        {/*<ButtonBold*/}
        {/*    disabled={publicKeyHolder?.holder === 'public-key-store'}*/}
        {/*    onClick={() => navigate('/private-message-store')}*/}
        {/*>*/}
        {/*  Private Message Store*/}
        {/*</ButtonBold></span>*/}
        {/*</Tooltip>*/}


        <List dense sx={{width: '100%', bgcolor: 'background.paper'}}>

          {menuDefs.map(({path, name, description}) => <ListItem
              key={path}
          >
            <ListItemButton onClick={() => navigate(path)}>
              <Tooltip title={description}>
                <StyledListItemText primary={name} secondary={description}/></Tooltip>
            </ListItemButton>
          </ListItem>)}


        </List>
      </Container>
  );
}
