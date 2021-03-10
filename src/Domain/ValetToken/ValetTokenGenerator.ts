import { Operation } from '../Operation/Operation'
import { Resource } from '../Resource/Resource'
import { Uuid } from '../Uuid/Uuid'
import { ValetToken } from './ValetToken'

/**
 * Generates a valet key for given user `uuid` that allows them to perform the `permittedOperation` on the `permittedResources` in the data store.
 */
export type GenerateValetToken = ({
  uuid, 
  permittedOperation,
  permittedResources,
}: {
  uuid: Uuid, 
  permittedOperation: Operation,
  permittedResources: Resource[],
}) => ValetToken

export interface ValetKeyGenerator {
  generate: GenerateValetToken
}