// https://betterprogramming.pub/exchanging-encrypted-data-on-blockchain-using-metamask-a2e65a9a896c

import { encrypt } from '@metamask/eth-sig-util';
import { Buffer } from 'buffer';

export function b64J(obj: unknown): string {
  return Buffer.from(JSON.stringify(obj)).toString('base64');
}

export function encryptData(publicKey: string, data: Buffer): string {
  // Returned object contains 4 properties: version, ephemPublicKey, nonce, ciphertext
  // Each contains data encoded using base64, version is always the same string
  const enc = encrypt({
    publicKey,
    data: data.toString('base64'),
    version: 'x25519-xsalsa20-poly1305'
  });

  // We want to store the data in smart contract, therefore we concatenate them
  // into single Buffer
  const buf = Buffer.concat([
    Buffer.from(enc.ephemPublicKey, 'base64'),
    Buffer.from(enc.nonce, 'base64'),
    Buffer.from(enc.ciphertext, 'base64')
  ]);

  return buf.toString('base64');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function openB64J(s: string): any {
  return JSON.parse(Buffer.from(s, 'base64').toString());
}

export function display64(s: string): string {
  if (!s || s.length < 9) {
    return s;
  }
  return `${s.substring(0, 4)}...${s.substring(s.length - 8)} (size: ${s.length})`;
}

export function displayAddress(s: string): string {
  try {
    return s.substring(0, 5) + '...' + s.substring(s.length - 4);
  } catch (e) {
    return s;
  }
}

export async function decryptData(publicAddress: string, data: Buffer): Promise<string> {
  // Reconstructing the original object outputed by encryption
  const structuredData = {
    version: 'x25519-xsalsa20-poly1305',
    ephemPublicKey: data.subarray(0, 32).toString('base64'),
    nonce: data.subarray(32, 56).toString('base64'),
    ciphertext: data.subarray(56).toString('base64')
  };
  // Convert data to hex string required by MetaMask
  const ct = `0x${Buffer.from(JSON.stringify(structuredData), 'utf8').toString('hex')}`;
  // Send request to MetaMask to decrypt the ciphertext
  // Once again application must have access to the publicAddress
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  const decrypt = await w?.ethereum?.request({
    method: 'eth_decrypt',
    params: [ct, publicAddress]
  });
  // Decode the base85 to final bytes
  return Buffer.from(decrypt, 'base64').toString();
}

export async function decryptContent<Content>(publicAddress: string, content64Enc: string): Promise<Content> {
  const content64 = await decryptData(publicAddress, Buffer.from(content64Enc, 'base64'));
  return openB64J(content64);
}

export function encryptContent(publicKey: string, content: unknown) {
  const content64 = b64J(content);
  return encryptData(publicKey, Buffer.from(content64));
}
