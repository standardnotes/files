import { CrypterInterface as Crypter } from '../Encryption/CrypterInterface'
import { ValetPayload, ValetToken } from './ValetToken'

export type JwtSecret = string
export type ValetTokenSecret = string

export type GenerateValetToken = ({
  payload,
  jwtSecret,
  valetTokenSecret,
  crypter,
}: {
  payload: ValetPayload,
  jwtSecret: JwtSecret,
  valetTokenSecret: ValetTokenSecret,
  crypter: Crypter,
}) => Promise<ValetToken>
