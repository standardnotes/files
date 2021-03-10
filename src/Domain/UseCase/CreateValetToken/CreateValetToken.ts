import { injectable } from 'inversify'
import { isOperationPermitted } from '../../Operation/isOperationPermitted'
import { ValetToken } from '../../ValetToken/ValetToken'
import { CreateValetKeyDto } from './CreateValetTokenDto'
import { CreateValetKeyResponse } from './CreateValetTokenResponse'
import { UseCaseInterface } from '../UseCaseInterface'
import { generateValetToken } from '../../ValetToken/generateValetToken'

@injectable()
export class CreateValetToken implements UseCaseInterface {
  /**
   * Given a request from the API Gateway containing auth data for a user and the requested file operations generates a valet key which can be used to perform these operations directly via the Files Service.
   */
  async execute(dto: CreateValetKeyDto): Promise<CreateValetKeyResponse> {
    const { user, operation, resources } = dto
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

    const valetToken: ValetToken = generateValetToken({
      uuid, 
      permittedOperation: operation,
      permittedResources: resources,
    })

    return { success: true, valetToken }
  }
}
