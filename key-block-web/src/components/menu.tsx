import KeyBlockTableUi from './key-block/KeyBlockTableUi';
import { PublicKeyStoreUi } from './public-key-store/PublicKeyStoreUi';
import { PrivateMessageStoreUi } from './private-message-store/PrivateMessageStoreUi';
import { JSX } from 'react';
import { About } from './About';
import { ToolsUi } from './tools/ToolsUi';

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
