import { inject, injectable } from 'inversify'
import { isOperationPermitted } from '../../Operation/isOperationPermitted'
import { ValetToken } from '../../ValetToken/ValetToken'
import { CreateValetKeyDto } from './CreateValetTokenDto'
import { CreateValetKeyResponse } from './CreateValetTokenResponse'
import { UseCaseInterface } from '../UseCaseInterface'
import { generateValetToken } from '../../ValetToken/generateValetToken'
import TYPES from '../../../Bootstrap/Types'
import { JwtSecret, ValetTokenSecret } from '../../ValetToken/ValetTokenGenerator'
import { CrypterInterface } from '../../Encryption/CrypterInterface'

@injectable()
export class CreateValetToken implements UseCaseInterface {
  constructor(
    @inject(TYPES.JWT_SECRET) private jwtSecret: JwtSecret,
    @inject(TYPES.VALET_TOKEN_SECRET) private valetTokenSecret: ValetTokenSecret,
    @inject(TYPES.Crypter) private crypter: CrypterInterface,
  ) {}

  /**
   * Given a request from the API Gateway containing auth data for a user and the requested file operations generates a valet key which can be used to perform these operations directly via the Files Service.
   */
  async execute(dto: CreateValetKeyDto): Promise<CreateValetKeyResponse> {
    // todo: validate period in controller
    const { user, operation, resources, validityPeriod } = dto
    const { permissions, uuid } = user

    if (!isOperationPermitted({
      operation,
      permissions,
      resources,
    })) return {
      success: false,
      error: {
        message: `User ${uuid} is not authorized to perform the requested operation.`,
        forbiddenOperation: operation,
      },
    }

    const valetToken: ValetToken = await generateValetToken({
      uuid, 
      permittedOperation: operation,
      permittedResources: resources,
      validityPeriod,
      jwtSecret: this.jwtSecret,
      valetTokenSecret: this.valetTokenSecret,
      crypter: this.crypter,
    })

    return { success: true, valetToken }
  }
}
