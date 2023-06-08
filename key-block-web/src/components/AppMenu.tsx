import { Stack, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { usePublicKeyHolder } from '../redux-support';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export function AppMenu() {
  const navigate = useNavigate();

  const publicKeyHolder = usePublicKeyHolder();

  return (
    <Stack>
      <Button onClick={() => navigate('/login')}>
        Login &nbsp;{' '}
        {!!publicKeyHolder ? <CheckCircleIcon color={'success'} /> : <RadioButtonUncheckedIcon color={'warning'} />}
      </Button>
      <Tooltip title={'Save your passwords in the most possible safe and secure way!'}>
        <Button onClick={() => navigate('/key-block')}>Key Block</Button>
      </Tooltip>
      <Tooltip title={'Provide your public key for others to send you encrypted data, including messages.'}>
        <Button onClick={() => navigate('/public-key-store')}>Public Key Store</Button>
      </Tooltip>
      <Tooltip title={'Send and receive encrypted and save messages!'}>
        <Button
          disabled={publicKeyHolder?.holder === 'public-key-store'}
          onClick={() => navigate('/private-message-store')}
        >
          Private Message Store
        </Button>
      </Tooltip>
    </Stack>
  );
}
