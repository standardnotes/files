import { ValetPayload, ValidityPeriod, } from './ValetToken'
import dayjs = require('dayjs')
import { dateFormat, defaultExpiresAfterSeconds } from './constants'
import { Operation } from '../Operation/Operation'
import { Resource } from '../Resource/Resource'
import { Uuid } from '../Uuid/Uuid'
import { DateString } from '../Date/Date'

export function createValetPayload({
  uuid, 
  permittedOperation,
  permittedResources,
  validityPeriod: optValidityPeriod,
  // by default valid from current date
  defaultDate = dayjs().format(dateFormat),
}: {
  uuid: Uuid, 
  permittedOperation: Operation,
  permittedResources: Resource[],
  validityPeriod?: Partial<ValidityPeriod>,
  defaultDate?: DateString,
}): ValetPayload {
  const defaultPeriod = {
    date: defaultDate,
    expiresAfterSeconds: defaultExpiresAfterSeconds,
  }

  const { date, expiresAfterSeconds } = optValidityPeriod || defaultPeriod

  const validityPeriod = {
    date: date === undefined? defaultPeriod.date: date,
    expiresAfterSeconds: expiresAfterSeconds === undefined?
      defaultPeriod.expiresAfterSeconds: 
      expiresAfterSeconds,
  }

  return {
    userUuid: uuid,
    permittedOperation,
    permittedResources,
    validityPeriod,
  }
}
