import { ValidatedValue } from '../Validation/Validation'
import { Uuid } from './Uuid'

/**
 * Checks if a value of type `any` (e.g. from a request) is a valid UUID.
 * todo: validate with a regex
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateUuid(uuid: any): ValidatedValue<Uuid> {
  if (typeof uuid !== 'string') return {
    success: false,
    error: 'Uuid must be a string'
  }

  return {
    success: true,
    value: uuid,
  }
}