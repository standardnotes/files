import 'reflect-metadata'
import { injectable } from 'inversify'
import { CrypterInterface } from '../CrypterInterface'

@injectable()
export class CrypterStub implements CrypterInterface {
  async encrypt(value: string, secret: string): Promise<string> {
    return `${value}:${secret}`
  }

  async decrypt(value: string, secret: string): Promise<string> {
    const [v, s] = value.split(':')

    if (s !== secret) {
      throw Error(`Could not decrypt ${value}. Wrong secret: ${secret}!`)
    }

    return v
  }
}
