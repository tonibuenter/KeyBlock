import ReactMarkdown from 'react-markdown';
import { DarkEnabledBox } from './common/StyledBoxes';

import md from './md/about.md';

export function About() {
  return (
    <DarkEnabledBox>
      <ReactMarkdown>{`${md} 
      
# Welcome to Key Block

## Mini Blockchain Apps

Key Block is a collection of mini apps that illustrate the usage of simple EVM-compatible smart contracts. 
The mini apps show the pivotal usage of blockchain technologie that would otherwise not be possible with classic applications.

This comprises:

- The data highly independent of cloud provider
- The data does is transactional safe
- Your data can be encrypted as safe as your private key is kept safe.
- The data and transaction provided by the smart contracts is independent of the mini apps them self.
    
`}</ReactMarkdown>
    </DarkEnabledBox>
  );
}
