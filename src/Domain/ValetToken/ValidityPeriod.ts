import { DateString } from '../Date/DateString'

export type ValidityPeriod = {
  // ISO 8601, formatted as "yyyy-MM-ddTHH:mm:ssZ"
  date: DateString,
  // assuming no more than a few days (AWS has max 7 days)
  expiresAfterSeconds: number,
}
