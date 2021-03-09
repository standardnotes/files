import { ResourceOperation } from '../Resource/ResourceOperation'
import { Uuid, ValetKey } from './ValetKey'

/**
 * Generates a valet key for given user `uuid` that allows them to perform the `permittedOperations` on the data store.
 */
export type ValetKeyGenerate = ({
  uuid, 
  permittedOperations,
}: {
  uuid: Uuid, 
  permittedOperations: ResourceOperation[],
}) => ValetKey

export interface ValetKeyGenerator {
  generate: ValetKeyGenerate
}