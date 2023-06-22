import { Container, ListItem, ListItemButton, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import { StyledListItemText } from './common/StyledComponents';
import { menuDefs } from './menu';

export function AppMenu() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <List dense sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {menuDefs.map(({ path, name, description }) => (
          <ListItem key={path}>
            <ListItemButton onClick={() => navigate('/' + path)}>
              <Tooltip title={description}>
                <StyledListItemText primary={name} secondary={description} />
              </Tooltip>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
