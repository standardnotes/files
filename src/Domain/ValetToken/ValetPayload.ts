import { Operation } from '../Operation/Operation'
import { Resource } from '../Resource/Resource'
import { Uuid } from '../Uuid/Uuid'
import { ValidityPeriod } from './ValidityPeriod'

export type ValetPayload = {
  userUuid: Uuid,
  permittedOperation: Operation,
  permittedResources: Resource[],
  validityPeriod: ValidityPeriod,
}
