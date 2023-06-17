import {
  Box,
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
import { ChangeEvent, Fragment, useCallback, useEffect, useState } from 'react';
import { errorMessage, infoMessage, isStatusMessage, StatusMessage } from '../../types';
import { dispatchLoading, dispatchStatusMessage, useNetworkId, usePublicAddress, useWeb3 } from '../../redux-support';
import { grey } from '@mui/material/colors';
import { StatusMessageElement } from '../utils';
import { getBlockchainByNetworkId, getContractAddressByNetworkId } from '../Web3InfoPage';
import Web3 from 'web3';
import {
  decryptMessage,
  GetOutBoxResult,
  PrivateMessageStore_getOutBox,
  PrivateMessageStore_lenOutBox
} from '../../contracts/private-message-store/PrivateMessageStore-support';
import moment from 'moment';
import { AddressDisplayWithAddressBook } from './AddressDisplayWithAddressBook';
import CheckIcon from '@mui/icons-material/Check';

type OutMessage = GetOutBoxResult & { subject?: string; text?: string; displayText?: boolean };
type SetOutMessages = (setMessage: (messages: OutMessage[]) => OutMessage[]) => void;

export function PrivateMessageOutBoxUi() {
  const theme = useTheme();
  const networkId = useNetworkId();
  const web3 = useWeb3();
  const publicAddress = usePublicAddress();
  const [outMessages, setOutMessages] = useState<OutMessage[]>([]);
  const [filterValue, setFilterValue] = useState('');
  const [numberOfEntries, setNumberOfEntries] = useState(-1);

  useEffect(() => {
    const load = async () => {
      await refreshOutMessages(publicAddress, networkId, web3, setNumberOfEntries, setOutMessages);
    };
    load().catch(console.error);
  }, [web3, publicAddress, networkId]);

  const MessageActions = useCallback(
    ({ message }: { message: OutMessage }) => {
      return (
        <Stack direction={'row'}>
          <DecryptButton address={publicAddress} message={message} setMessages={setOutMessages} />{' '}
          <ToggleButton message={message} setMessages={setOutMessages} />
        </Stack>
      );
    },
    [publicAddress]
  );

  const renderMessageOuBoxTable = useCallback(() => {
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
          key={'header'}
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
        </Stack>
        {noMessages ? (
          <StatusMessageElement
            statusMessage={infoMessage(`No sent messages found on: ${getBlockchainByNetworkId(networkId || 0)}`)}
          />
        ) : (
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell key={'index'}>Nr</TableCell>
                <TableCell key={'receiver'}>Receiver</TableCell>
                <TableCell key={'subject'}>Subject</TableCell>
                <TableCell key={'inserted'}>Date</TableCell>
                <TableCell key={'confirmed'}>Confirmed</TableCell>
                <TableCell key={'actions'}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {outMessages
                .filter(
                  (row) =>
                    !filterValue || (row.subject && row.subject.toLowerCase().includes(filterValue.toLowerCase()))
                )
                .map((row, index) => (
                  <Fragment key={'frag-' + index}>
                    <TableRow key={'row-detail' + row.index}>
                      <TableCell key={'index'}>{1 + index}</TableCell>
                      <TableCell key={'receiver'}>
                        <AddressDisplayWithAddressBook address={row.receiver}></AddressDisplayWithAddressBook>
                      </TableCell>
                      <TableCell key={'subject'}>{row.subject ? row.subject : '***'}</TableCell>
                      <TableCell key={'inserted'}>{moment(row.inserted * 1000).format('YYYY-MM-DD HH:mm')}</TableCell>
                      <TableCell key={'confirmed'}>{row.confirmed ? <CheckIcon /> : ''}</TableCell>
                      <TableCell key={'actions'}>
                        <MessageActions message={row} />
                      </TableCell>
                    </TableRow>
                    {row.subject && row.displayText ? (
                      <TableRow key={'row-text' + row.index}>
                        <TableCell colSpan={6}>
                          <Box>{row.text}</Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      ''
                    )}
                  </Fragment>
                ))}
            </TableBody>
          </Table>
        )}
        <Stack key={'footer'} direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
          <StatusMessageElement statusMessage={statusMessage} />
          <Button
            onClick={() => {
              refreshOutMessages(publicAddress, networkId, web3, setNumberOfEntries, setOutMessages).catch(
                console.error
              );
            }}
          >
            Refresh
          </Button>
        </Stack>
      </TableContainer>
    );
  }, [publicAddress, web3, numberOfEntries, outMessages, filterValue, networkId, theme.palette, MessageActions]);

  return <Stack>{renderMessageOuBoxTable()}</Stack>;
}

async function refreshOutMessages(
  publicAddress: string | undefined,
  networkId: number,
  web3: Web3 | undefined,
  setNumberOfEntries: (n: number) => void,
  setOutMessages: SetOutMessages
) {
  if (!publicAddress || !web3 || !networkId) {
    return;
  }
  setOutMessages(() => []);
  try {
    dispatchLoading('Reading entries...');
    dispatchStatusMessage();
    const len = await PrivateMessageStore_lenOutBox(web3, publicAddress);
    if (isStatusMessage(len)) {
      setNumberOfEntries(0);
      dispatchStatusMessage(len);
      return;
    } else {
      setNumberOfEntries(len);
    }
    const messages: GetOutBoxResult[] = [];
    for (let index = 0; index < len; index++) {
      const message = await PrivateMessageStore_getOutBox(web3, publicAddress, index);
      if (isStatusMessage(message)) {
        dispatchStatusMessage(message);
        return;
      } else {
        messages.push(message);
      }
    }
    setOutMessages(() => messages);
  } catch (e) {
    dispatchStatusMessage(errorMessage('Serious Error', e));
  } finally {
    dispatchLoading('');
  }
}

type DecryptButtonProps = { address?: string; message: OutMessage; setMessages: SetOutMessages };

function DecryptButton({ address, message, setMessages }: DecryptButtonProps) {
  const active = !!address && !message.subject;
  return (
    <Button
      disabled={!active}
      key={'decrypt'}
      onClick={async () => {
        if (active) {
          try {
            const inBoxOpened = await decryptMessage({
              address,
              subjectEnc: message.subjectOutBox,
              textEnc: message.textOutBox
            });
            if (isStatusMessage(inBoxOpened)) {
              console.debug(inBoxOpened);
            } else {
              setMessages((messages: OutMessage[]) => {
                const m: OutMessage[] = [...messages];
                m[message.index] = { ...message, ...inBoxOpened, displayText: true };
                return m;
              });
            }
          } catch (e) {
            console.error(e);
          }
        }
      }}
    >
      Decrypt
    </Button>
  );
}

type ToggleButtonProps = { message: OutMessage; setMessages: SetOutMessages };

function ToggleButton({ message, setMessages }: ToggleButtonProps) {
  return (
    <Button
      disabled={!message.subject}
      key={'toggle'}
      onClick={() =>
        setMessages((messages: OutMessage[]) => {
          const d = [...messages];
          messages[message.index].displayText = !messages[message.index].displayText;
          return d;
        })
      }
    >
      toggle
    </Button>
  );
}
