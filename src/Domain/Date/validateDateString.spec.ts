import { InvalidValue, ValidValue } from '../Validation/Validation'

import { validateDateString } from './validateDateString'

describe('validateDateString', () => {
  it('should succeed on string that conforms to format', async () => {
    const date = '2021-03-12'
    const result = validateDateString(date, 'YYYY-MM-DD') as ValidValue<string>

    expect(result.success).toEqual(true)
    expect(result.value).toEqual(date)
  })
  it('should fail on non-string', async () => {
    const result = validateDateString(undefined, 'YYYY-MM-DD') as InvalidValue

    expect(result.success).toEqual(false)
    expect(result.error).toBeDefined()
  })
  it('should fail on string that does not conform to format', async () => {
    const date = '2021-03-12T18:00'
    const result = validateDateString(date, 'YYYY-MM-DD') as InvalidValue

    expect(result.success).toEqual(false)
    expect(result.error).toBeDefined()
  })
})
