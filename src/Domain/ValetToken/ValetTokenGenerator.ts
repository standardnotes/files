import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import { sign, verify } from 'jsonwebtoken'
import TYPES from '../../Bootstrap/Types'
import { CrypterInterface } from '../Encryption/CrypterInterface'
import { ValetPayload } from './ValetPayload'
import { ValetToken } from './ValetToken'

@injectable()
export class ValetTokenGenerator {
  constructor(
    @inject(TYPES.Crypter) private crypter: CrypterInterface,
    @inject(TYPES.JWT_SECRET) private jwtSecret: string,
    @inject(TYPES.VALET_TOKEN_SECRET) private valetTokenSecret: string,
  ) {}

  async generateValetToken(payload: ValetPayload): Promise<ValetToken> {
    const jwt = sign(JSON.stringify(payload), this.jwtSecret, { algorithm: 'HS256' })
  
    return this.crypter.encrypt(jwt, this.valetTokenSecret)
  }

  async valetTokenToPayload(token: ValetToken): Promise<ValetPayload> {
    const jwt = await this.crypter.decrypt(token, this.valetTokenSecret)
  
    const payload = verify(jwt, this.jwtSecret, { algorithms: ['HS256'] }) as ValetPayload
  
    return payload
  }
}
