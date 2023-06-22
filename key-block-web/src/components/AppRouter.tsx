import Login from './Login';
import { Box, Container, Stack } from '@mui/material';
import { DynStatusMessageElement } from './utils';
import Loader from './Loader';
import { AppHeader } from './AppHeader';
import { createHashRouter, Outlet, RouterProvider, useNavigate, useRouteError } from 'react-router-dom';
import Button from '@mui/material/Button';
import { AppMenu } from './AppMenu';
import { usePublicAddress } from '../redux-support';
import { useEffect } from 'react';
import { menuDefs } from './menu';

const router = createHashRouter(
  [
    {
      path: '*',
      element: <AppNavigation />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: '*',
          element: <AppMenu />
        },
        ...menuDefs.map(({ path, element }) => ({ path, element }))
      ]
    },

    {
      path: '/login',
      element: <Login />,
      errorElement: <ErrorPage />
    }
  ],
  {
    //basename
  }
);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

function AppNavigation() {
  const publicAddress = usePublicAddress();
  const navigate = useNavigate();

  useEffect(() => {
    if (!publicAddress) {
      navigate('/login');
    }
  }, [publicAddress, navigate]);

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
      <AppHeader />

      <Box mt={'1em'} mb={'1em'}>
        <DynStatusMessageElement />
      </Box>

      <Container key={'app-menu'} maxWidth={false}>
        <Stack spacing={2} mt={'1em'} mb={'1em'}>
          <Outlet />
        </Stack>
        <Loader />
      </Container>
    </Box>
  );
}

export function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();
  let errorString = '???';

  if (typeof error === 'object') {
    errorString = JSON.stringify(error);
  } else if (error === 'string' || error === 'number') {
    errorString = '' + error;
  }

  return (
    <Stack
      sx={{
        border: 'red dashed 1px',
        top: '2em',
        right: '2em',
        bottom: '2em',
        left: '2em',
        position: 'absolute'
      }}
      padding={2}
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <Box sx={{ color: 'red' }}>
        <h2>Welcome to the error page!</h2>
        <h3>Error:</h3>
        <Box>{errorString}</Box>
      </Box>
      <Button onClick={() => navigate('/')}>Back</Button>
    </Stack>
  );
}
