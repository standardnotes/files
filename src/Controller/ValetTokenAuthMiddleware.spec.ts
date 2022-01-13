import 'reflect-metadata'

import { ValetTokenAuthMiddleware } from './ValetTokenAuthMiddleware'
import { NextFunction, Request, Response } from 'express'
import { Logger } from 'winston'
import { ValetTokenGeneratorInterface } from '../Domain/ValetToken/ValetTokenGeneratorInterface'

describe('ValetTokenAuthMiddleware', () => {
  let valetTokenGenerator: ValetTokenGeneratorInterface
  let request: Request
  let response: Response
  let next: NextFunction

  const logger = {
    debug: jest.fn(),
  } as unknown as jest.Mocked<Logger>

  const createMiddleware = () => new ValetTokenAuthMiddleware(
    valetTokenGenerator,
    logger,
  )

  beforeEach(() => {
    valetTokenGenerator = {} as jest.Mocked<ValetTokenGeneratorInterface>
    valetTokenGenerator.toPayload = jest.fn().mockReturnValue({
      userUuid: '1-2-3',
      permittedOperation: 'write',
      permittedResources: [
        '1-2-3/2-3-4',
      ],
      validityPeriod: {
        date: '2022-01-13 10:00:00',
        expiresAfterSeconds: 123,
      },
    })

    request = {
      headers: {},
      query: {},
      body: {},
    } as jest.Mocked<Request>
    response = {
      locals: {},
    } as jest.Mocked<Response>
    response.status = jest.fn().mockReturnThis()
    response.send = jest.fn()
    next = jest.fn()
  })

  it('should authorize user with a valet token', async () => {
    request.headers['x-valet-token'] = 'valet-token'

    await createMiddleware().handler(request, response, next)

    expect(response.locals).toEqual({
      userUuid: '1-2-3',
      permittedOperation: 'write',
      permittedResources: [
        '1-2-3/2-3-4',
      ],
    })

    expect(next).toHaveBeenCalled()
  })

  it('should not authorize if request is missing valet token in headers', async () => {
    await createMiddleware().handler(request, response, next)

    expect(response.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })

  it('should not authorize if auth valet token is malformed', async () => {
    request.headers['x-valet-token'] = 'valet-token'

    valetTokenGenerator.toPayload = jest.fn().mockReturnValue(undefined)

    await createMiddleware().handler(request, response, next)

    expect(response.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })

  it('should pass the error to next middleware if one occurres', async () => {
    request.headers['x-valet-token'] = 'valet-token'

    const error = new Error('Ooops')

    valetTokenGenerator.toPayload = jest.fn().mockImplementation(() => {
      throw error
    })

    await createMiddleware().handler(request, response, next)

    expect(response.status).not.toHaveBeenCalled()

    expect(next).toHaveBeenCalledWith(error)
  })
})
