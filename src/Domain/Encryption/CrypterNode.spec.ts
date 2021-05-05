import 'reflect-metadata'
import { CrypterNode } from './CrypterNode'

import { createHash } from 'crypto'
import { HexString } from '@standardnotes/sncrypto-common'

describe('CrypterNode', () => {
  it('should succeed on string that conforms to format', async () => {
    const crypto = new CrypterNode(
      () => makeHexIv('initVector')
    )

    const key = 'secretKey'

    const unencrypted = 'hello world 🌍'
    const encrypted = await crypto.encrypt(unencrypted, key)
    const decrypted = await crypto.decrypt(encrypted, key)
    expect(decrypted).toEqual(unencrypted)
  })
})

const ivBytes = CrypterNode.ivBytes
// IV allocated according to https://nodejs.org/en/knowledge/cryptography/how-to-use-crypto-module/#how-to-use-cipher-algorithms-with-crypto
function makeHexIv(ivString: string): HexString {
  const iv32 = createHash('sha256').update(ivString).digest()
  const iv16 = Buffer.allocUnsafe(ivBytes)
  const bytesCopied = iv32.copy(iv16)
  if (bytesCopied !== ivBytes) {
    throw Error(
      `IV allocation failed! Expected ${ivBytes}, but copied ${bytesCopied}.`
    )
  }
  return iv16.toString('hex')
}
