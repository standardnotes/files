import { inject, injectable } from 'inversify'
import { OperationValidator } from '../../Operation/OperationValidator'
import { ValetToken } from '../../ValetToken/ValetToken'
import { CreateValetKeyDto } from './CreateValetTokenDto'
import { CreateValetTokenResponse } from './CreateValetTokenResponse'
import { UseCaseInterface } from '../UseCaseInterface'
import TYPES from '../../../Bootstrap/Types'
import { ValetTokenGenerator } from '../../ValetToken/ValetTokenGenerator'
import { ValetPayloadGenerator } from '../../ValetToken/ValetPayloadGenerator'

@injectable()
export class CreateValetToken implements UseCaseInterface {
  constructor(
    @inject(TYPES.OperationValidator) private operationChecker: OperationValidator,
    @inject(TYPES.ValetPayloadGenerator) private payloadGenerator: ValetPayloadGenerator,
    @inject(TYPES.ValetTokenGenerator) private tokenGenerator: ValetTokenGenerator,
  ) {}

  /**
   * Given a request from the API Gateway containing auth data for a user and the requested file operations generates a valet key which can be used to perform these operations directly via the Files Service.
   */
  async execute(dto: CreateValetKeyDto): Promise<CreateValetTokenResponse> {
    const { user, operation, resources, validityPeriod } = dto
    const { permissions, uuid } = user

    if (!this.operationChecker.isOperationPermitted({
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

    const payload = this.payloadGenerator.createValetPayload({
      uuid, 
      permittedOperation: operation,
      permittedResources: resources,
      validityPeriod,
    })

    const valetToken: ValetToken = await this.tokenGenerator.generateValetToken(payload)

    return { success: true, valetToken }
  }
}
