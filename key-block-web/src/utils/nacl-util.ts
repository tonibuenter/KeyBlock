// Source https://github.com/dchest/tweetnacl-js/wiki/Examples#box

import { box, BoxKeyPair, randomBytes } from 'tweetnacl';

export const newNonce = (): Uint8Array => randomBytes(box.nonceLength);
export const generateKeyPair = (): BoxKeyPair => box.keyPair();

export const encrypt = (secretKey: Uint8Array, data: Uint8Array, publicKey: Uint8Array): Uint8Array => {
  const nonce = newNonce();
  const encrypted = box(data, nonce, publicKey, secretKey);
  const fullEncrypted = new Uint8Array(nonce.length + encrypted.length);
  fullEncrypted.set(nonce);
  fullEncrypted.set(encrypted, nonce.length);
  return fullEncrypted;
};

export const decrypt = (secretKey: Uint8Array, data: Uint8Array, publicKey: Uint8Array): Uint8Array | null => {
  const nonce = data.subarray(0, box.nonceLength);
  const contentOnly = data.subarray(box.nonceLength, data.length);
  return box.open(contentOnly, nonce, publicKey, secretKey);
};

export function u8ToHex(u: Uint8Array): string {
  return Buffer.from(u).toString('hex');
}

export function hexToU8(hexString: string): Uint8Array {
  if (hexString.length % 2 !== 0) {
    console.error('Invalid hexString');

    return new Uint8Array();
  }

  var arrayBuffer = new Uint8Array(hexString.length / 2);

  for (var i = 0; i < hexString.length; i += 2) {
    var byteValue = parseInt(hexString.substr(i, 2), 16);

    if (isNaN(byteValue)) {
      console.error('Invalid hexString');

      return new Uint8Array();
    }

    arrayBuffer[i / 2] = byteValue;
  }

  return arrayBuffer;
}

export function displayKey(s: string): string {
  if (!s || s.length < 9) {
    return s;
  }
  return `${s.substring(0, 4)}...${s.substring(s.length - 4)}`;
}
