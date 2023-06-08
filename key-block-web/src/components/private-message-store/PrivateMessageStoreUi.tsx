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
import { errorMessage, infoMessage, isStatusMessage, StatusMessage } from '../../types';
import { dispatchLoading, dispatchStatusMessage, useNetworkId, usePublicAddress, useWeb3 } from '../../redux-support';
import { grey } from '@mui/material/colors';
import { StatusMessageElement } from '../utils';
import { getBlockchainByNetworkId, getContractAddressByNetworkId } from '../Web3InfoPage';
import Web3 from 'web3';
import {
  GetInBoxResult,
  PrivateMessageStore_getInBox,
  PrivateMessageStore_lenInBox
} from '../../contracts/private-message-store/PrivateMessageStore-support';
import { PrivateMessageViewUi } from './PrivateMessageViewUi';
import { PrivateMessageNewUi } from './PrivateMessageNewUi';

const PrivateMessageStoreUi: FC = () => {
  const theme = useTheme();
  const networkId = useNetworkId();
  const web3 = useWeb3();
  const publicAddress = usePublicAddress();
  const [messages, setMessages] = useState<GetInBoxResult[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<GetInBoxResult | 'new'>();
  const [filterValue, setFilterValue] = useState('');
  const [numberOfEntries, setNumberOfEntries] = useState(-1);

  useEffect(() => {
    const load = async () => {
      await refreshFromBlockchain(publicAddress, networkId, web3, setNumberOfEntries, setMessages);
    };
    load().catch(console.error);
  }, [web3, publicAddress, networkId]);

  const renderMessageInBoxTable = useCallback(() => {
    let statusMessage: StatusMessage | undefined = undefined;
    if (!getContractAddressByNetworkId(networkId)) {
      statusMessage = infoMessage(`No contract for: ${getBlockchainByNetworkId(networkId || 0)}`);
    } else if (numberOfEntries === -1) {
      statusMessage = infoMessage(`Trying to read messages from: ${getBlockchainByNetworkId(networkId || 0)}`);
    }
    if (statusMessage) {
      return <StatusMessageElement statusMessage={statusMessage} />;
    }
    const noMessages = numberOfEntries === 0;
    return (
      <TableContainer key="table" component={Paper}>
        <Stack
          direction={'row'}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          mb={'1em'}
          sx={{ backgroundColor: theme.palette.mode === 'dark' ? grey['900'] : grey.A100 }}
        >
          <TextField
            disabled={noMessages}
            size={'small'}
            label={'Name filter'}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFilterValue(e.target.value)}
            value={filterValue}
          />
          <Button
            onClick={() => {
              setSelectedMessage('new');
            }}
          >
            New Entry
          </Button>
        </Stack>{' '}
        {noMessages ? (
          <StatusMessageElement
            statusMessage={infoMessage(`No messages found on: ${getBlockchainByNetworkId(networkId || 0)}`)}
          />
        ) : (
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell key={'index'}>Index</TableCell>
                <TableCell key={'sender'}>Sender</TableCell>
                <TableCell key={'subject'}>Subject</TableCell>
                <TableCell key={'confirmed'}>Confirmed</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {messages
                .filter((row) => row.subjectInBox.toLowerCase().includes(filterValue.toLowerCase()))
                .map((row, index) => (
                  <TableRow
                    sx={{ cursor: 'pointer' }}
                    hover={true}
                    onClick={() => {
                      setSelectedMessage({ ...row });
                    }}
                    key={row.index}
                  >
                    <TableCell key={'index'}>{index}</TableCell>
                    <TableCell key={'subject'}>{row.subjectInBox}</TableCell>
                    <TableCell key={'name'}>{row.sender}</TableCell>
                    <TableCell key={'confirmed'}>{row.confirmed}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
        <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
          <StatusMessageElement statusMessage={statusMessage} />
          <Button
            onClick={() => {
              refreshFromBlockchain(publicAddress, networkId, web3, setNumberOfEntries, setMessages).catch(
                console.error
              );
            }}
          >
            Refresh
          </Button>
        </Stack>
      </TableContainer>
    );
  }, [publicAddress, web3, numberOfEntries, messages, filterValue, networkId]);

  return (
    <Stack>
      {renderMessageInBoxTable()}
      {selectedMessage === 'new' ? (
        <PrivateMessageNewUi done={() => setSelectedMessage(undefined)} />
      ) : selectedMessage ? (
        <PrivateMessageViewUi message={selectedMessage} done={() => setSelectedMessage(undefined)} />
      ) : (
        <></>
      )}
    </Stack>
  );
};
export default PrivateMessageStoreUi;

async function refreshFromBlockchain(
  publicAddress: string | undefined,
  networkId: number,
  web3: Web3 | undefined,
  setNumberOfEntries: (n: number) => void,
  setRows: (messages: GetInBoxResult[]) => void
) {
  if (!publicAddress || !web3 || !networkId) {
    return;
  }
  setRows([]);
  try {
    dispatchLoading('Reading entries...');
    dispatchStatusMessage();
    const len = await PrivateMessageStore_lenInBox(web3, publicAddress);
    if (isStatusMessage(len)) {
      setNumberOfEntries(0);
      dispatchStatusMessage(len);
      return;
    } else {
      setNumberOfEntries(len);
    }
    const messages: GetInBoxResult[] = [];
    for (let index = 0; index < len; index++) {
      const message = await PrivateMessageStore_getInBox(web3, publicAddress, index);
      if (isStatusMessage(message)) {
        dispatchStatusMessage(message);
        return;
      } else {
        messages.push(message);
      }
    }
    setRows(messages);
  } catch (e) {
    dispatchStatusMessage(errorMessage('Serious Error', e));
  } finally {
    dispatchLoading('');
  }
}
