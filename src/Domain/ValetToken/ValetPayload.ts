import { Operation } from '../Operation/Operation'
import { Resource } from '../Resource/Resource'
import { Uuid } from '../Uuid/Uuid'
import { ValidityPeriod } from './ValidityPeriod'

export type ValetPayload = {
  // who
  userUuid: Uuid,
  // can do what
  permittedOperation: Operation,
  // with what
  permittedResources: Resource[],
  // from when to when
  validityPeriod: ValidityPeriod,
}
