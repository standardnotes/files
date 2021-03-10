import { Operation } from '../Operation/Operation'
import { Resource } from '../Resource/Resource'
import { Uuid } from '../Uuid/Uuid'


export type ValetToken = string
export type DateString = string
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