import { defaultExpiresAfterSeconds } from './ValetToken'
import { createValetPayload } from './createValetPayload'
import { valetPayload } from './test/data'

describe('createValetPayload', () => {
  it('should create a valid payload for full validity period', () => {
    const output = createValetPayload({
      uuid: valetPayload.userUuid,
      permittedOperation: valetPayload.permittedOperation,
      permittedResources: valetPayload.permittedResources,
      validityPeriod: valetPayload.validityPeriod,
    })

    expect(output).toEqual(valetPayload)
  })
  it('should create a valid payload for validity period without expiresAfterSeconds', () => {
    const period = { date: '2021-03-15T18:13:48Z' }

    const output = createValetPayload({
      uuid: valetPayload.userUuid,
      permittedOperation: valetPayload.permittedOperation,
      permittedResources: valetPayload.permittedResources,
      validityPeriod: period,
    })

    expect(output).toEqual({
      ...valetPayload, 
      validityPeriod: {
        ...period,
        expiresAfterSeconds: defaultExpiresAfterSeconds,
      }
    })
  })
  it('should create a valid payload for validity period without date', () => {
    const period = { expiresAfterSeconds: 7200 }
    const defaultDate = '1991-03-15T18:13:48Z'

    const output = createValetPayload({
      uuid: valetPayload.userUuid,
      permittedOperation: valetPayload.permittedOperation,
      permittedResources: valetPayload.permittedResources,
      validityPeriod: period,
      defaultDate,
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { validityPeriod: payloadPeriod, ...payloadWithoutPeriod } = valetPayload
    const { validityPeriod: outputPeriod, ...outputWithoutPeriod } = output

    expect(outputWithoutPeriod).toEqual(payloadWithoutPeriod)
    expect(outputPeriod.expiresAfterSeconds).toEqual(period.expiresAfterSeconds)
    expect(outputPeriod.date).toEqual(defaultDate)
  })
  it('should create a valid payload for missing validity period', () => {
    const defaultDate = '1991-03-15T18:13:48Z'

    const output = createValetPayload({
      uuid: valetPayload.userUuid,
      permittedOperation: valetPayload.permittedOperation,
      permittedResources: valetPayload.permittedResources,
      defaultDate,
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { validityPeriod: payloadPeriod, ...payloadWithoutPeriod } = valetPayload
    const { validityPeriod: outputPeriod, ...outputWithoutPeriod } = output

    expect(outputWithoutPeriod).toEqual(payloadWithoutPeriod)
    expect(outputPeriod).toEqual({
      date: defaultDate,
      expiresAfterSeconds: defaultExpiresAfterSeconds,
    })
  })
})
