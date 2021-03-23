import { UuidValidator } from './UuidValidator'

describe('CreateValetTokenValidation', () => {
  const { validateUuid } = new UuidValidator()
  it('should succeed on valid UUID', async () => {
    const uuid = '00000000-0000-0000-0000-000000000000'
    const output = validateUuid(uuid)

    expect(output.success).toEqual(true)
  })
  it('should fail on invalid UUID', async () => {
    const output = validateUuid('123')

    expect(output.success).toEqual(false)
  })
  it('should fail on non-string UUID', async () => {
    const output = validateUuid(undefined)

    expect(output.success).toEqual(false)
  })
})
