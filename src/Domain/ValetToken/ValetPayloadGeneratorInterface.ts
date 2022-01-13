import { DateString } from '../Date/DateString'
import { Operation } from '../Operation/Operation'
import { Resource } from '../Resource/Resource'
import { Uuid } from '../Uuid/Uuid'
import { ValetPayload } from './ValetPayload'
import { ValidityPeriod } from './ValidityPeriod'

export interface ValetPayloadGeneratorInterface {
  createValetPayload(dto: {
    uuid: Uuid,
    permittedOperation: Operation,
    permittedResources: Resource[],
    validityPeriod?: Partial<ValidityPeriod>,
    defaultDate?: DateString,
  }): ValetPayload
}
