import 'reflect-metadata'
import dayjs = require('dayjs')
import { injectable } from 'inversify'
import { ValidatedValue } from '../Validation/ValidatedValue'
import { DateString } from './DateString'

@injectable()
export class DateValidator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  validateString = (date: any, format: string): 
  ValidatedValue<DateString> => {
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

  static daysToSeconds = (n: number): number => n * 24 * 60 * 60
  static hoursToSeconds = (n: number): number => n * 60 * 60
  static minutesToSeconds = (n: number): number => n * 60
}
