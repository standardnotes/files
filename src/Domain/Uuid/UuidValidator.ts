import 'reflect-metadata'
import { ValidatedValue } from '../Validation/ValidatedValue'
import { Uuid } from './Uuid'
import { validate } from 'uuid'
import { injectable } from 'inversify'

@injectable()
export class UuidValidator {
  validateUuid = (uuid: unknown): ValidatedValue<Uuid> => {
    if (typeof uuid !== 'string') return {
      success: false,
      error: 'UUID must be a string'
    }
  
    if (!validate(uuid)) return {
      success: false,
      error: `Invalid UUID: ${uuid}`
    }
  
    return {
      success: true,
      value: uuid,
    }
  }
}
