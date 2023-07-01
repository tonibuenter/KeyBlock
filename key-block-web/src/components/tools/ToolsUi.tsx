import * as React from 'react';
import { useState } from 'react';
import { Box, Container } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Mnemonic2Keys } from './Mnemonic2Keys';

export function ToolsUi() {
  const [tabValue, setTabValue] = useState(0);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={(event: React.SyntheticEvent, newValue: number) => {
            setTabValue(newValue);
          }}
        >
          <Tab key={'phrase-to-keys'} label="Mnemonic to Keys" />
          <Tab key={'1'} label="1" />
          <Tab key={'2'} label="2" />
        </Tabs>
      </Box>
      <Container sx={{ marginTop: '1em' }}>
        <Box key={0} sx={{ display: tabValue === 0 ? 'block' : 'none' }}>
          <Mnemonic2Keys />
        </Box>
        <Box key={1} sx={{ display: tabValue === 1 ? 'block' : 'none' }}>
          1111
        </Box>
        <Box key={2} sx={{ display: tabValue === 2 ? 'block' : 'none' }}>
          222
        </Box>
      </Container>
    </Box>
  );
}
