import { v4 as uuid } from 'uuid'
import { inject, injectable } from 'inversify'
import { TokenEncoderInterface, ValetTokenData } from '@standardnotes/auth'

import { CreateValetTokenDTO } from './CreateValetTokenDTO'
import { CreateValetTokenResponse } from './CreateValetTokenResponse'
import { UseCaseInterface } from '../UseCaseInterface'
import TYPES from '../../../Bootstrap/Types'

@injectable()
export class CreateValetToken implements UseCaseInterface {
  constructor(
    @inject(TYPES.ValetTokenEncoder) private tokenEncoder: TokenEncoderInterface<ValetTokenData>,
    @inject(TYPES.VALET_TOKEN_TTL) private valetTokenTTL: number,
  ) {
  }

  async execute(dto: CreateValetTokenDTO): Promise<CreateValetTokenResponse> {
    let permittedResources = dto.resources ?? []
    if (dto.operation === 'write') {
      permittedResources = [ uuid() ]
    }

    const tokenData: ValetTokenData = {
      userUuid: dto.userUuid,
      permittedOperation: dto.operation,
      permittedResources,
    }

    const valetToken = this.tokenEncoder.encodeExpirableToken(tokenData, this.valetTokenTTL)

    return { success: true, valetToken }
  }
}
