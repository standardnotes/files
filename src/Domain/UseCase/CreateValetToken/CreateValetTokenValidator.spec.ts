import express = require('express')
import { DateValidator } from '../../Date/DateValidator'
import { UuidValidator } from '../../Uuid/UuidValidator'
import { CreateValetTokenValidator } from './CreateValetTokenValidator'
import { insufficientPermissionsDto, sufficientPermissionsDto, badPermissionsUser } from './test/data'

describe('CreateValetTokenValidation', () => {
  const {
    validateRequest,
    validateUserPermissions,
    validateOperation,
  } = new CreateValetTokenValidator(
    new DateValidator(),
    new UuidValidator(),
  )

  it('should succeed on valid body', async () => {
    const requestMock = { body: sufficientPermissionsDto } as express.Request
    const output = validateRequest(requestMock)

    expect(output.success).toEqual(true)
  })
  it('should succeed on valid body with correct validity period', async () => {
    const oks = [
      {
        date: '2021-03-15T17:11:00Z',
        expiresAfterSeconds: 3000,
      },
      { expiresAfterSeconds: 3000 },
      { date: '2021-03-15T17:11:00Z' },
    ]

    oks.forEach(ok => {
      const requestMock = { body: {
        ...sufficientPermissionsDto,
        validityPeriod: ok,
      } } as express.Request
      const output = validateRequest(requestMock)

      expect(output.success).toEqual(true)
    })
  })
  it('should fail on valid body with bad permissions', async () => {
    const requestMock = { body: {
      ...insufficientPermissionsDto,
      user: badPermissionsUser,
    } } as express.Request
    const output = validateRequest(requestMock)

    expect(output.success).toEqual(false)
  })
  it('should fail on valid body with bad operation', async () => {
    const requestMock = { body: {
      ...sufficientPermissionsDto,
      operation: undefined,
    } } as express.Request
    const output = validateRequest(requestMock)

    expect(output.success).toEqual(false)
  })
  it('should fail on valid body with bad resources', async () => {
    const requestMock = { body: {
      ...sufficientPermissionsDto,
      resources: undefined,
    } } as express.Request
    const output = validateRequest(requestMock)

    expect(output.success).toEqual(false)

    const requestMock2 = { body: {
      ...sufficientPermissionsDto,
      resources: [{ name: undefined }],
    } } as express.Request
    const output2 = validateRequest(requestMock2)

    expect(output2.success).toEqual(false)
  })
  it('should fail on valid body with bad validity period', async () => {
    const bads = [
      { date: 'BAD' },
      { expiresAfterSeconds: 'BAD' },
      { date: 'BAD', expiresAfterSeconds: 'BAD' },
      { expiresAfterSeconds: 0 },
      { date: '2021-03-15T17:11:00Z', expiresAfterSeconds: 0 },
      { expiresAfterSeconds: Infinity },
    ]

    bads.forEach(bad => {
      const requestMock = { body: {
        ...sufficientPermissionsDto,
        validityPeriod: bad,
      } } as express.Request
      const output = validateRequest(requestMock)

      expect(output.success).toEqual(false)
    })
  })
  it('should fail on valid body with bad user UUID', async () => {
    const requestMock = { body: {
      ...insufficientPermissionsDto,
      user: {
        ...insufficientPermissionsDto.user,
        uuid: 'BAD',
      },
    } } as express.Request
    const output = validateRequest(requestMock)

    expect(output.success).toEqual(false)
  })
  it('should fail on empty body', async () => {
    const requestMock = { body: {} } as express.Request
    const output = validateRequest(requestMock)

    expect(output.success).toEqual(false)
  })

  it('validateUserPermissions should fail on missing permissions', async () => {
    const output = validateUserPermissions(undefined)

    expect(output.success).toEqual(false)
  })
  it('validateOperation should fail on missing operation', async () => {
    const output = validateOperation(undefined)

    expect(output.success).toEqual(false)
  })
})
