import { DateString } from '../Date/Date'
import { Operation } from '../Operation/Operation'
import { Resource } from '../Resource/Resource'
import { Uuid } from '../Uuid/Uuid'
import { hoursToSeconds, minutesToSeconds, daysToSeconds } from '../Date/Date'

export type ValetToken = string
export type ValetKeySignature = string

export type ValetStructure = {
  payload: ValetPayload,
  // authenticates the valet key
  signature: ValetSignature,
}

export type ValetSignature = string

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
export type ValidityPeriod = {
  // ISO 8601, formatted as "yyyy-MM-ddTHH:mm:ssZ"
  date: DateString,
  // assuming no more than a few days (AWS has max 7 days)
  expiresAfterSeconds: number,
}

// conformant to https://day.js.org/docs/en/display/format#list-of-all-available-formats
export const dateFormat = 'YYYY-MM-DDTHH:mm:ss[Z]'

export const defaultExpiresAfterSeconds = hoursToSeconds(2)
export const minExpiresAfterSeconds = minutesToSeconds(5)
export const maxExpiresAfterSeconds = daysToSeconds(7)
