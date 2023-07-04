import KeyBlockTableUi from './key-block/KeyBlockTableUi';
import { PublicKeyStoreUi } from './public-key-store/PublicKeyStoreUi';
import { PrivateMessageStoreUi } from './private-message-store/PrivateMessageStoreUi';
import { JSX } from 'react';
import { About } from './About';
import { ToolsUi } from './tools/ToolsUi';
import { UniqueNameStoreUi } from './unique-name-store/UniqueNameStoreUi';
import { FileEncryptionUi } from './file-encryption/FileEncryptionUi';

export type MenuDef = { path: string; name: string; description: string; element: JSX.Element };

export const menuDefs: MenuDef[] = [
  {
    path: 'key-block',
    name: 'My Secret Store',
    description: 'Save your passwords in the most possible safe and secure way.',
    element: <KeyBlockTableUi />
  },
  {
    path: 'public-key-store',
    name: 'Public Key Store',
    description: 'Provide your public key for others to send you encrypted data.',
    element: <PublicKeyStoreUi />
  },
  {
    path: 'private-message-store',
    name: 'Private & Safe Messages',
    description: 'Send and receive encrypted messages.',
    element: <PrivateMessageStoreUi />
  },
  {
    path: 'unique-name-store',
    name: 'My Unique Name',
    description: 'Connect a unique name to your address!',
    element: <UniqueNameStoreUi />
  },
  {
    path: 'file-encryption',
    name: 'File Encryption',
    description: 'Upload a file for encryption and decryption.',
    element: <FileEncryptionUi />
  },

  {
    path: 'tools',
    name: 'Tools',
    description: '',
    element: <ToolsUi />
  },
  {
    path: 'about',
    name: 'About',
    description: '',
    element: <About />
  }
];
