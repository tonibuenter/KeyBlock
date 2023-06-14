import Button from '@mui/material/Button';
import { useState } from 'react';
import { useAddressBook } from '../../redux-support';

export function AddressDisplayWithAddressBook({ address }: { address: string }) {
  const addressBook = useAddressBook();
  const [toggle, setToggle] = useState(false);

  return (
    <Button onClick={() => setToggle((t) => !t)}>
      {toggle ? address : addressBook.find((e) => e.address === address)?.name || address}
    </Button>
  );
}
