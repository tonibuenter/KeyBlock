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
import { ChangeEvent, FC, Fragment, useCallback, useEffect, useState } from 'react';
import { errorMessage, infoMessage, isStatusMessage, StatusMessage } from '../../types';
import { dispatchLoading, dispatchStatusMessage, useNetworkId, usePublicAddress, useWeb3 } from '../../redux-support';
import { grey } from '@mui/material/colors';
import { StatusMessageElement } from '../utils';
import { getBlockchainByNetworkId, getContractAddressByNetworkId } from '../Web3InfoPage';
import Web3 from 'web3';
import {
  decryptMessage,
  GetInBoxResult,
  PrivateMessageStore_confirm,
  PrivateMessageStore_getInBox,
  PrivateMessageStore_lenInBox
} from '../../contracts/private-message-store/PrivateMessageStore-support';
import { PrivateMessageViewUi } from './PrivateMessageViewUi';
import { PrivateMessageNewUi } from './PrivateMessageNewUi';
import moment from 'moment';
import { AddressDisplayWithAddressBook } from './AddressDisplayWithAddressBook';
import CheckIcon from '@mui/icons-material/Check';
import { PrivateMessageReplyUi } from './PrivateMessageReplyUi';

export type Message = GetInBoxResult & { subject?: string; text?: string; displayText?: boolean };
type SetMessage = (setMessage: (messages: Message[]) => Message[]) => void;

const PrivateMessageStoreUi: FC = () => {
  const theme = useTheme();
  const networkId = useNetworkId();
  const web3 = useWeb3();
  const publicAddress = usePublicAddress();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<GetInBoxResult | 'new'>();
  const [messageToReply, setMessageToReply] = useState<GetInBoxResult | null>(null);
  const [filterValue, setFilterValue] = useState('');
  const [numberOfEntries, setNumberOfEntries] = useState(-1);

  useEffect(() => {
    const load = async () => {
      await refreshFromBlockchain(publicAddress, networkId, web3, setNumberOfEntries, setMessages);
    };
    load().catch(console.error);
  }, [web3, publicAddress, networkId]);

  const MessageActions = useCallback(
    ({ message }: { message: Message }) => {
      return (
        <Stack direction={'row'}>
          <DecryptButton address={publicAddress} message={message} setMessages={setMessages} />{' '}
          <ToggleButton message={message} setMessages={setMessages} />
          <ConfirmButton message={message} web3={web3} address={publicAddress} />
          <Button disabled={!message.subject} onClick={() => setMessageToReply(message)}>
            reply
          </Button>
        </Stack>
      );
    },
    [web3, publicAddress]
  );

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
          <Button
            onClick={() => {
              setSelectedMessage('new');
            }}
          >
            New Private Message
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
                <TableCell key={'index'}>Nr</TableCell>
                <TableCell key={'sender'}>Sender</TableCell>
                <TableCell key={'subject'}>Subject</TableCell>
                <TableCell key={'inserted'}>Date</TableCell>
                <TableCell key={'confirmed'}>Confirmed</TableCell>
                <TableCell key={'actions'}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {messages
                .filter((row) => row.subjectInBox.toLowerCase().includes(filterValue.toLowerCase()))
                .map((row, index) => (
                  <Fragment key={'frag-' + index}>
                    <TableRow
                      // sx={{ cursor: 'pointer' }}
                      // hover={true}
                      // onClick={() => {
                      //   setSelectedMessage({ ...row });
                      // }}
                      key={'row-detail' + row.index}
                    >
                      <TableCell key={'index'}>{1 + index}</TableCell>
                      <TableCell key={'sender'}>
                        <AddressDisplayWithAddressBook address={row.sender}></AddressDisplayWithAddressBook>
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
  }, [publicAddress, web3, numberOfEntries, messages, filterValue, networkId, theme.palette, MessageActions]);

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
      {messageToReply ? (
        <PrivateMessageReplyUi messageToReply={messageToReply} done={() => setMessageToReply(null)} />
      ) : (
        ''
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

type DecryptButtonProps = { address?: string; message: Message; setMessages: SetMessage };

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
              subjectEnc: message.subjectInBox,
              textEnc: message.textInBox
            });
            if (isStatusMessage(inBoxOpened)) {
              console.debug(inBoxOpened);
            } else {
              setMessages((messages: Message[]) => {
                const m: Message[] = [...messages];
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

type ToggleButtonProps = { message: Message; setMessages: SetMessage };

function ToggleButton({ message, setMessages }: ToggleButtonProps) {
  return (
    <Button
      disabled={!message.subject}
      key={'toggle'}
      onClick={() =>
        setMessages((messages: Message[]) => {
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

type ConfirmButtonProps = { web3?: Web3; address?: string; message: Message };

function ConfirmButton({ web3, address, message }: ConfirmButtonProps) {
  const active = message.displayText && web3 && address && message.subject && !message.confirmed;

  return (
    <Button
      disabled={!active}
      key={'confirm'}
      onClick={async () => {
        if (active) {
          try {
            const res = await PrivateMessageStore_confirm(web3, address, message.index);
            if (isStatusMessage(res)) {
              console.debug(res);
            }
          } catch (e) {
            console.error(e);
          }
        }
      }}
    >
      confirm
    </Button>
  );
}
