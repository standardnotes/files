import { ValidatedValue } from '../Validation/Validation'
import { Uuid } from './Uuid'
import { validate } from 'uuid'

/**
 * Checks if a value of type `any` (e.g. from a request) is a valid UUID.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function validateUuid(uuid: any): ValidatedValue<Uuid> {
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
