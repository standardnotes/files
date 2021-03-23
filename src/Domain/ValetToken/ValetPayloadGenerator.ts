import 'reflect-metadata'
import dayjs = require('dayjs')
import { DateString } from '../Date/DateString'
import { Operation } from '../Operation/Operation'
import { Resource } from '../Resource/Resource'
import { Uuid } from '../Uuid/Uuid'
import { ValetPayload } from './ValetPayload'
import { ValidityPeriod } from './ValidityPeriod'
import { DateValidator } from '../Date/DateValidator'
import { injectable } from 'inversify'

const { hoursToSeconds, minutesToSeconds, daysToSeconds } = DateValidator

@injectable()
export class ValetPayloadGenerator {
  // conformant to https://day.js.org/docs/en/display/format#list-of-all-available-formats
  public static dateFormat = 'YYYY-MM-DDTHH:mm:ss[Z]'
  public static defaultExpiresAfterSeconds = hoursToSeconds(2)
  public static minExpiresAfterSeconds = minutesToSeconds(5)
  public static maxExpiresAfterSeconds = daysToSeconds(7)
  
  createValetPayload = ({
    uuid, 
    permittedOperation,
    permittedResources,
    validityPeriod: optValidityPeriod,
    // by default valid from current date
    defaultDate = dayjs().format(ValetPayloadGenerator.dateFormat),
  }: {
    uuid: Uuid, 
    permittedOperation: Operation,
    permittedResources: Resource[],
    validityPeriod?: Partial<ValidityPeriod>,
    defaultDate?: DateString,
  }): ValetPayload => {
    const defaultPeriod = {
      date: defaultDate,
      expiresAfterSeconds: ValetPayloadGenerator.defaultExpiresAfterSeconds,
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
}
