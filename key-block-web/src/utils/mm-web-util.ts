// https://betterprogramming.pub/exchanging-encrypted-data-on-blockchain-using-metamask-a2e65a9a896c
import { b64J, encryptData, openB64J } from './crypt-util';

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

export async function decryptContent<Content>(privatePublicAddress: string, content64Enc: string): Promise<Content> {
  const content64 = await decryptData(privatePublicAddress, Buffer.from(content64Enc, 'base64'));
  return openB64J(content64);
}

export function encryptContent(publicKey: string, content: unknown) {
  const content64 = b64J(content);
  return encryptData(publicKey, Buffer.from(content64));
}
