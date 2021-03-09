import { ResourceOperation } from '../Resource/ResourceOperation'

export type Uuid = string
export type DateString = string
export type ValetKeySignature = string

export type ValetKey = {
  // authenticates the valet key
  signature: ValetKeySignature,
  // who
  userUuid: Uuid,
  // can do what with what
  permittedOperations: ResourceOperation[],
  // from when to when
  validityPeriod: ValidityPeriod,
}
export type ValidityPeriod = {
  // ISO 8601, formatted as "yyyy-MM-ddTHH:mm:ssZ"
  date: DateString,
  // assuming no more than a few days (AWS has max 7 days)
  expiresAfterSeconds: number,
}