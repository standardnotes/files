import { NextFunction, Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import { BaseMiddleware } from 'inversify-express-utils'
import { Logger } from 'winston'
import TYPES from '../Bootstrap/Types'
import { ValetTokenGeneratorInterface } from '../Domain/ValetToken/ValetTokenGeneratorInterface'

@injectable()
export class ValetTokenAuthMiddleware extends BaseMiddleware {
  constructor (
    @inject(TYPES.ValetTokenGenerator) private valetTokenGenerator: ValetTokenGeneratorInterface,
    @inject(TYPES.Logger) private logger: Logger,
  ) {
    super()
  }

  async handler(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const valetToken = request.headers['x-valet-token'] || request.body.valetToken || request.query.valetToken
      if (!valetToken) {
        this.logger.debug('ValetTokenAuthMiddleware missing valet token.')

        response.status(401).send({
          error: {
            tag: 'invalid-auth',
            message: 'Invalid valet token.',
          },
        })

        return
      }

      const valetTokenPayload = await this.valetTokenGenerator.toPayload(valetToken)

      if (valetTokenPayload === undefined) {
        this.logger.debug('ValetTokenAuthMiddleware authentication failure.')

        response.status(401).send({
          error: {
            tag: 'invalid-auth',
            message: 'Invalid valet token.',
          },
        })

        return
      }

      valetTokenPayload.validityPeriod.date

      response.locals.userUuid = valetTokenPayload.userUuid
      response.locals.permittedResources = valetTokenPayload.permittedResources
      response.locals.permittedOperation = valetTokenPayload.permittedOperation

      return next()
    } catch (error) {
      return next(error)
    }
  }
}
