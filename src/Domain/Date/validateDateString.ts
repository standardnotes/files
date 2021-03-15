import dayjs = require('dayjs')
import { ValidatedValue } from '../Validation/Validation'
import { DateString } from './Date'

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function validateDateString(date: any, format: string): ValidatedValue<DateString> {
  if (typeof date !== 'string') return {
    success: false,
    error: 'Date is missing or invalid.',
  }

  if (dayjs(date, format, true).isValid()) return {
    success: true,
    value: date,
  }

  return {
    success: false,
    error: `Date does not conform to format ${format}: ${date}.`
  }
}