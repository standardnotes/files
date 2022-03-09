import { TokenDecoderInterface, ValetTokenData } from '@standardnotes/auth'
import { NextFunction, Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import { BaseMiddleware } from 'inversify-express-utils'
import { Logger } from 'winston'
import TYPES from '../Bootstrap/Types'

@injectable()
export class ValetTokenAuthMiddleware extends BaseMiddleware {
  constructor (
    @inject(TYPES.ValetTokenDecoder) private tokenDecoder: TokenDecoderInterface<ValetTokenData>,
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

      const valetTokenData = this.tokenDecoder.decodeToken(valetToken)

      if (valetTokenData === undefined) {
        this.logger.debug('ValetTokenAuthMiddleware authentication failure.')

        response.status(401).send({
          error: {
            tag: 'invalid-auth',
            message: 'Invalid valet token.',
          },
        })

        return
      }

      if (this.userHasNoSpaceToUpload(valetTokenData, +(request.headers['content-length'] as string))) {
        response.status(403).send({
          error: {
            tag: 'no-space',
            message: 'The file you are trying to upload is too big. Please upgrade your subscription',
          },
        })

        return
      }

      response.locals.userUuid = valetTokenData.userUuid
      response.locals.permittedResources = valetTokenData.permittedResources
      response.locals.permittedOperation = valetTokenData.permittedOperation

      return next()
    } catch (error) {
      return next(error)
    }
  }

  private userHasNoSpaceToUpload(valetTokenData: ValetTokenData, contentLength: number) {
    if (valetTokenData.permittedOperation !== 'write') {
      return false
    }

    if (valetTokenData.uploadBytesLimit === -1) {
      return false
    }

    const remainingUploadSpace = valetTokenData.uploadBytesLimit - valetTokenData.uploadBytesUsed

    return remainingUploadSpace - contentLength <= 0
  }
}
