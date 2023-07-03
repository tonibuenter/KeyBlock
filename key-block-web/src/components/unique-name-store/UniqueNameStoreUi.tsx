import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { errorMessage, infoMessage, isStatusMessage, successMessage, warningMessage } from '../../types';
import { Box, Divider, Grid, Stack } from '@mui/material';
import { dispatchSnackbarMessage, useNetworkId, usePublicAddress, useWeb3 } from '../../redux-support';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { StatusMessageElement } from '../utils';
import { wrapPromise } from '../../utils';
import { AddressBoxWithCopy } from '../common/AddressBoxWithCopy';
import { ContractName, getContractAddress } from '../../contracts/network-info';
import ReactMarkdown from 'react-markdown';
import {
  UniqueNameStore_getAddress,
  UniqueNameStore_getName,
  UniqueNameStore_setName,
  UniqueNameStore_unSetName
} from '../../contracts/unique-name-store/UniqueNameStore-support';
import { displayAddress } from '../../utils/crypt-util';

export function UniqueNameStoreUi() {
  const web3 = useWeb3();
  const publicAddress = usePublicAddress();
  const [savedName, setSavedName] = useState('');
  const [myName, setMyName] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const networkId = useNetworkId();

  const getMyName = useCallback(async () => {
    if (!web3 || !publicAddress) {
      return;
    }
    const uniqueName = await wrapPromise(
      UniqueNameStore_getName(web3, publicAddress, publicAddress),
      'Reading my Unique Name'
    );
    if (isStatusMessage(uniqueName)) {
      dispatchSnackbarMessage(uniqueName);
      return;
    } else if (!uniqueName) {
      dispatchSnackbarMessage(infoMessage(`There is no name saved for ${displayAddress(publicAddress)}`));
    }
    setMyName(uniqueName);
    setSavedName(uniqueName);
  }, [web3, publicAddress]);

  const saveMyName = useCallback(async () => {
    if (!web3 || !publicAddress) {
      return;
    }
    const addressFound = await wrapPromise(
      UniqueNameStore_getAddress(web3, myName, publicAddress),
      `Checking if ${myName} is already taken...`
    );
    if (isStatusMessage(addressFound)) {
      dispatchSnackbarMessage(addressFound);
      return;
    }
    if (isValidAddress(addressFound)) {
      dispatchSnackbarMessage(errorMessage(`The name "${myName}" is taken!`));
      return;
    }
    dispatchSnackbarMessage(infoMessage(`The name "${myName}" is not taken. Try to save it...`));
    await wrapPromise(UniqueNameStore_setName(web3, myName, publicAddress), `Saving "${myName}"`);
    dispatchSnackbarMessage(successMessage(`The blockchain is processing your name "${myName}"`));
  }, [web3, publicAddress, myName]);

  const removeMyName = useCallback(async () => {
    if (!web3 || !publicAddress) {
      return;
    }
    const res = await wrapPromise(UniqueNameStore_unSetName(web3, publicAddress), `Try to remove my name...`);
    if (isStatusMessage(res)) {
      dispatchSnackbarMessage(res);
      return;
    }
    dispatchSnackbarMessage(successMessage(`The blockchain is removing the name.`));
    setSavedName('');
    setMyName('');
  }, [web3, publicAddress]);

  useEffect(() => {
    getMyName().catch(console.error);
  }, [getMyName]);

  const contractAddress = getContractAddress(networkId, ContractName.PublicKeyStore);
  if (!contractAddress) {
    return <StatusMessageElement statusMessage={errorMessage(`No contract found!`)} />;
  }

  if (!publicAddress) {
    return <StatusMessageElement statusMessage={warningMessage(`No public address available!`)} />;
  }
  if (!web3) {
    return <StatusMessageElement statusMessage={warningMessage('Web3 is not initialized!')} />;
  }

  return (
    <Stack spacing={2}>
      <ReactMarkdown>{`
# Your Unique Name

Here you can save a unique name for your address. The address will be seen by everybody who like to 
resolve your address with the unique name.

You can:

- *save*: Save the new or changed name to the blockchain
- *refresh*: Refresh - reading from the blockchain - your saved name
- *remove*: Completely remove the name on the blockchain.
- *find name*: Read the name of a given address from the blockchain.
- *find address*: Read the address from a given name - if it is taken.
    
`}</ReactMarkdown>

      <Divider key={'my-stuff-divider'} />

      <Grid key={'my-stuff-grid'} container justifyContent="flex-start" alignItems="center" spacing={6}>
        <Grid key={'public-address-label'} item sm={2}>
          <Box sx={{ fontWeight: 600 }}>Your Address</Box>
        </Grid>
        <Grid key={'public-address'} item sm={9}>
          <AddressBoxWithCopy value={publicAddress} />
        </Grid>

        <Grid key={'my-name-label'} item sm={2}>
          <Box sx={{ fontWeight: 600 }}>My Unique Name</Box>
        </Grid>
        <Grid key={'my-name'} item sm={9}>
          <TextField
            placeholder={'Your unique name'}
            value={myName}
            onChange={(e) => setMyName(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid key={'buttons'} item sm={9}>
          <Button key={'save'} disabled={!myName || myName === savedName} onClick={saveMyName}>
            Save
          </Button>
          <Button key={'refresh'} disabled={myName === savedName} onClick={getMyName}>
            Refresh
          </Button>
          <Button key={'remove'} disabled={!savedName} onClick={removeMyName}>
            Remove
          </Button>
        </Grid>
      </Grid>

      <Divider key={'find-divider'} />

      <Grid key={'find-grid'} container justifyContent="flex-start" alignItems="center" spacing={6}>
        <Grid key={'search-label'} item sm={2}>
          <Box sx={{ fontWeight: 600 }}>Search by Name/Address</Box>
        </Grid>
        <Grid key={'search-value'} item sm={9}>
          <TextField
            placeholder={'Address or Name'}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid key={'buttons'} item sm={9}>
          <Button
            key={'find-name'}
            disabled={!isValidAddress(searchValue)}
            onClick={async () => {
              if (!isValidAddress(searchValue)) {
                dispatchSnackbarMessage(errorMessage('The search value is not an address!'));
                return;
              }
              const name = await wrapPromise(
                UniqueNameStore_getName(web3, searchValue, publicAddress),
                `Reading name for address ${searchValue}`
              );
              if (isStatusMessage(name)) {
                dispatchSnackbarMessage(name);
                return;
              }
              if (!name) {
                dispatchSnackbarMessage(successMessage(`No name saved for "${searchValue}"`));
                return;
              }
              dispatchSnackbarMessage(successMessage(`Found name: "${name}"`));
            }}
          >
            Find name
          </Button>
          <Button
            key={'find-address'}
            disabled={!searchValue}
            onClick={async () => {
              if (!searchValue) {
                return;
              }
              const address = await wrapPromise(
                UniqueNameStore_getAddress(web3, searchValue, publicAddress),
                `Reading name for address ${searchValue}`
              );
              if (isStatusMessage(address)) {
                dispatchSnackbarMessage(address);
                return;
              }
              if (!isValidAddress(address)) {
                dispatchSnackbarMessage(successMessage(`No address found for name "${searchValue}"`));
                return;
              }
              dispatchSnackbarMessage(successMessage(`Found address: "${address}"`));
            }}
          >
            Find address
          </Button>
        </Grid>
      </Grid>
    </Stack>
  );
}

function isValidAddress(s: string | null | undefined): boolean {
  if (!s) {
    return false;
  }
  try {
    const n = BigInt(s);
    return n !== BigInt(0);
  } catch (e) {
    return false;
  }
}
