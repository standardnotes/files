import { CrypterInterface as Crypter } from '../Encryption/CrypterInterface'
import { ValetPayload, ValetToken } from './ValetToken'

export type JwtSecret = string
export type ValetTokenSecret = string

/**
 * Generates a valet key for given user `uuid` that allows them to perform the `permittedOperation` on the `permittedResources` in the data store.
 */
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

export interface ValetKeyGenerator {
  generate: GenerateValetToken
}