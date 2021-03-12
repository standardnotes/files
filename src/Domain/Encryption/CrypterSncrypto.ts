import { SNPureCrypto } from '@standardnotes/sncrypto-common'
import { inject, injectable } from 'inversify'
import TYPES from '../../Bootstrap/Types'
import { CrypterInterface } from './CrypterInterface'

const ENCRYPTION_VERSION = 1

@injectable()
export class CrypterSncrypto implements CrypterInterface {
  constructor (
    @inject(TYPES.SNCrypto) private snCrypto: SNPureCrypto,
  ) {
  }

  async encrypt(value: string, secret: string): Promise<string> {
    const nonce = await this.snCrypto.generateRandomKey(192)

    const encrypted = await this.snCrypto.xchacha20Encrypt(
      value,
      nonce,
      secret,
      ''
    )

    return this.formatEncryptedValue(ENCRYPTION_VERSION, encrypted, nonce)
  }

  async decrypt(value: string, secret: string): Promise<string | null> {
    const [ version, ciphertext, nonce ] = value.split(':')

    if (+version !== ENCRYPTION_VERSION) {
      throw Error (`Not supported encryption version: ${version}`)
    }

    return this.snCrypto.xchacha20Decrypt(
      ciphertext,
      nonce,
      secret,
      ''
    )
  }

  private formatEncryptedValue(version: number, encryptedValue: string, nonce: string): string {
    return [ version, encryptedValue, nonce ].join(':')
  }
}
