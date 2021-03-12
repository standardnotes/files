import express = require('express')
import { validateCreateValetTokenRequest } from './CreateValetTokenValidation'
import { validDto } from './CreateValetToken.data.spec'

// todo: more comprehensive
describe('CreateValetTokenValidation', () => {
  it('should succeed on valid body', async () => {
    const requestMock = { body: validDto } as express.Request
    const output = validateCreateValetTokenRequest(requestMock)

    expect(output.success).toEqual(true)
  })
  it('should fail on empty body', async () => {
    const requestMock = { body: {} } as express.Request
    const output = validateCreateValetTokenRequest(requestMock)

    expect(output.success).toEqual(false)
  })
})
