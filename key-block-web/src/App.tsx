import { Provider } from 'react-redux';
import { createReduxStore } from './redux';
import { createContext, useMemo, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';
import { blue, orange } from '@mui/material/colors';
import { AppRouter } from './components/AppRouter';
import { Snackbar } from './components/Snackbar';

export const ColorModeContext = createContext({
  toggleColorMode: () => {}
});

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      }
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: blue,
          secondary: orange
        },
        components: {
          // Name of the component
          MuiTooltip: {
            defaultProps: {
              // The props to change the default for.
              arrow: true // No more ripple!
            }
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none' // Disable the uppercase transformation globally
              }
            }
          }
        }
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <Provider store={createReduxStore()}>
          <AppRouter />
          <Snackbar />
        </Provider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
