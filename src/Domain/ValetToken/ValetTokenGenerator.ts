import { CrypterInterface as Crypter } from '../Encryption/CrypterInterface'
import { Operation } from '../Operation/Operation'
import { Resource } from '../Resource/Resource'
import { Uuid } from '../Uuid/Uuid'
import { ValetToken, ValidityPeriod } from './ValetToken'

export type JwtSecret = string
export type ValetTokenSecret = string

/**
 * Generates a valet key for given user `uuid` that allows them to perform the `permittedOperation` on the `permittedResources` in the data store.
 */
export type GenerateValetToken = ({
  uuid, 
  permittedOperation,
  permittedResources,
  validityPeriod,
  jwtSecret,
  valetTokenSecret,
  crypter,
}: {
  uuid: Uuid, 
  permittedOperation: Operation,
  permittedResources: Resource[],
  validityPeriod?: Partial<ValidityPeriod>,
  jwtSecret: JwtSecret,
  valetTokenSecret: ValetTokenSecret,
  crypter: Crypter,
}) => Promise<ValetToken>

export interface ValetKeyGenerator {
  generate: GenerateValetToken
}