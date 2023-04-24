import { Provider } from 'react-redux';
import { createReduxStore } from './redux';
import { createContext, useMemo, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';
import { blue, orange } from '@mui/material/colors';
import { KeyBlockApp } from './components/KeyBlockApp';

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
          }
        }
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <Provider store={createReduxStore()}>
          <KeyBlockApp />
        </Provider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
