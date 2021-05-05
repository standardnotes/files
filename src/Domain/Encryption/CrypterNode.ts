import 'reflect-metadata'
import { injectable } from 'inversify'
import { CrypterInterface } from './CrypterInterface'
import { SnCryptoNode } from '@standardnotes/sncrypto-node'
import { createHash, randomBytes } from 'crypto'
import { HexString } from '@standardnotes/sncrypto-common'
import { EncryptedString } from './EncryptedString'

@injectable()
export class CrypterNode implements CrypterInterface {
  /**
   * @param getHexIv must return a 16-byte hex string suitable for AES 256 GCM initialization vector.
   */
  constructor(
    /* istanbul ignore next */
    private getHexIv = CrypterNode.getRandomHexIv
  ) {}

  private crypto = new SnCryptoNode()

  /**
   * Encrypts `plaintext` with `secretKey` via AES 256 GCM.
   * Expects parameters in utf-8.
   */
  async encrypt(
    plaintext: string,
    secretKey: string,
  ): Promise<EncryptedString> {
    const iv = this.getHexIv()
    const key = createHash('sha256').update(secretKey).digest('hex')

    const encrypted = await this.crypto.aes256GcmEncrypt({ 
      unencrypted: plaintext, 
      iv, 
      key,
    })

    return JSON.stringify(encrypted)
  }

  /**
   * Decrypts `encryptedString` with `secretKey`.
   * @param encryptedString returned by CrypterNode::encrypt
   * @param secretKey in utf-8
   */
  async decrypt(encryptedStr: EncryptedString, secretKey: string): Promise<string> {
    const encrypted = JSON.parse(encryptedStr)
    const decrypted = await this.crypto.aes256GcmDecrypt(
      encrypted, 
      createHash('sha256').update(secretKey).digest('hex'),
    )

    return decrypted
  }

  /**
   * Must be 16 bytes (128 bits) for AES 256 GCM:
   * https://nodejs.org/en/knowledge/cryptography/how-to-use-crypto-module/#how-to-use-cipher-algorithms-with-crypto
   */
  public static ivBytes = 16
  /**
   * Returns a random 16-byte hex string suitable for AES 256 GCM initialization vector.
   */
  /* istanbul ignore next */
  private static getRandomHexIv(): HexString {
    return randomBytes(CrypterNode.ivBytes).toString('hex')
  }
}
