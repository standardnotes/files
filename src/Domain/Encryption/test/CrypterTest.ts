import 'reflect-metadata'
import { injectable } from 'inversify'
import { CrypterInterface } from '../CrypterInterface'

@injectable()
export class CrypterTest implements CrypterInterface {
  async encrypt(value: string, secret: string): Promise<string> {
    return `${value}:${secret}`
  }

  async decrypt(value: string, secret: string): Promise<string | null> {
    const [v, s] = value.split(':')

    if (s !== secret) return null

    return v
  }
}
