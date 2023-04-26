import {
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  useTheme
} from '@mui/material';
import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';
import { EmptyItem, errorMessage, infoMessage, isStatusMessage, Item, StatusMessage } from '../types';
import { KeyBlockEntry } from './KeyBlockEntryUi';
import { dispatchLoading, dispatchStatusMessage, useNetworkId, usePublicAddress, useWeb3 } from '../redux-support';
import { grey } from '@mui/material/colors';
import { KeyBlock_get, KeyBlock_len } from '../contracts/KeyBlock-support';
import { StatusMessageElement } from './utils';
import { getBlockchainByNetworkId, getContractAddressByNetworkId } from './Web3InfoPage';
import { display64 } from '../utils/crypt-util';
import Web3 from 'web3';

const KeyBlockTableUi: FC = () => {
  const theme = useTheme();
  const networkId = useNetworkId();
  const web3 = useWeb3();
  const publicAddress = usePublicAddress();
  const [rows, setRows] = useState<Item[]>([]);
  const [editItem, setEditItem] = useState(EmptyItem);
  const [filterValue, setFilterValue] = useState('');
  const [openEditor, setOpenEditor] = useState(false);
  const [numberOfEntries, setNumberOfEntries] = useState(-1);

  useEffect(() => {
    const load = async () => {
      await refreshFromBlockchain(publicAddress, networkId, web3, setNumberOfEntries, setRows);
    };
    load().catch(console.error);
  }, [web3, publicAddress, networkId]);

  // const update = useCallback(
  //   (item0: Item) =>
  //     setRows((rows) => {
  //       if (item0.index === -1) {
  //         return [...rows, { ...item0, index: rows.length }];
  //       } else {
  //         return rows.map((r) => (r.index === item0.index ? item0 : r));
  //       }
  //     }),
  //   []
  // );

  const renderKeyBlockEntryTable = useCallback(() => {
    let statusMessage: StatusMessage | undefined = undefined;
    if (!getContractAddressByNetworkId(networkId)) {
      statusMessage = errorMessage(`No KeyBlock contract found on ${getBlockchainByNetworkId(networkId || 0)}`);
    } else if (numberOfEntries === -1) {
      statusMessage = infoMessage(`Trying to read KeyBlock entries from ${getBlockchainByNetworkId(networkId || 0)}`);
    } else if (numberOfEntries === 0) {
      statusMessage = infoMessage(
        `No KeyBlock entries found on Blockchain ${getBlockchainByNetworkId(networkId || 0)}`
      );
    }
    if (statusMessage) {
      return <StatusMessageElement statusMessage={statusMessage} />;
    }
    return (
      <TableContainer key="table" component={Paper}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell key={'index'}>Index</TableCell>
              <TableCell key={'inserted'}>Inserted</TableCell>
              <TableCell key={'name'}>Name</TableCell>
              <TableCell key={'secret'}>Secret (encrypted)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .filter((row) => row.name.includes(filterValue))
              .map((row) => (
                <TableRow
                  sx={{ cursor: 'pointer' }}
                  hover={true}
                  onClick={() => {
                    setEditItem({ ...row });
                    setOpenEditor(true);
                  }}
                  key={row.index}
                >
                  <TableCell key={'index'}>{row.index}</TableCell>
                  <TableCell key={'inserted'}>{row.inserted}</TableCell>
                  <TableCell key={'name'}>{row.name}</TableCell>
                  <TableCell key={'secret'}>{display64(row.secret)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
          <Button onClick={() => refreshFromBlockchain(publicAddress, networkId, web3, setNumberOfEntries, setRows)}>
            Refresh data from blockchain
          </Button>
        </Stack>
      </TableContainer>
    );
  }, [publicAddress, web3, numberOfEntries, rows, filterValue, networkId]);

  return (
    <Stack>
      <Stack
        direction={'row'}
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        mb={'1em'}
        sx={{ backgroundColor: theme.palette.mode === 'dark' ? grey['900'] : grey.A100 }}
      >
        <TextField
          size={'small'}
          label={'Name filter'}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setFilterValue(e.target.value)}
          value={filterValue}
        />
        <Button
          onClick={() => {
            setEditItem({ ...EmptyItem });
            setOpenEditor(true);
          }}
        >
          New Entry
        </Button>
      </Stack>
      {renderKeyBlockEntryTable()}

      <KeyBlockEntry
        item={editItem}
        open={openEditor}
        done={() => {
          setOpenEditor(false);
        }}
        update={() => refreshFromBlockchain(publicAddress, networkId, web3, setNumberOfEntries, setRows)}
      />
    </Stack>
  );
};
export default KeyBlockTableUi;

async function refreshFromBlockchain(
  publicAddress: string | undefined,
  networkId: number,
  web3: Web3 | undefined,
  setNumberOfEntries: (n: number) => void,
  setRows: (items: Item[]) => void
) {
  if (!publicAddress || !web3 || !networkId) {
    return;
  }
  setRows([]);
  try {
    dispatchLoading('Reading entries...');
    dispatchStatusMessage();
    const len = await KeyBlock_len(web3, publicAddress);
    if (isStatusMessage(len)) {
      setNumberOfEntries(0);
      dispatchStatusMessage(len);
      return;
    } else {
      setNumberOfEntries(len);
    }
    const items: Item[] = [];
    for (let index = 0; index < len; index++) {
      const entry = await KeyBlock_get(web3, publicAddress, index);
      if (isStatusMessage(entry)) {
        dispatchStatusMessage(entry);
        return;
      } else {
        const item: Item = { index, name: entry[0], secret: entry[1], inserted: entry[2] };
        items.push(item);
      }
    }
    setRows(items);
  } catch (e) {
    dispatchStatusMessage(errorMessage('Serious Error', e));
  } finally {
    dispatchLoading('');
  }
}
