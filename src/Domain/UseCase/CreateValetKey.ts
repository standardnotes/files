import { inject, injectable } from 'inversify'
import TYPES from '../../Bootstrap/Types'
import { isOperationPermitted } from '../Resource/isOperationPermitted'
import { ValetKey } from '../ValetKey/ValetKey'
import { ValetKeyGenerator } from '../ValetKey/ValetKeyGenerator'
import { CreateValetKeyDto } from './CreateValetKeyDto'
import { CreateValetKeyResponse } from './CreateValetKeyResponse'
import { UseCaseInterface } from './UseCaseInterface'

@injectable()
export class CreateValetKey implements UseCaseInterface {
  constructor(
    @inject(TYPES.ValetKeyGenerator) private valetKeyGenerator: ValetKeyGenerator,
  ) {
  }
  
  /**
   * Given a request from the API Gateway containing auth data for a user and the requested file operations generates a valet key which can be used to perform these operations directly via the Files Service.
   */
  async execute(dto: CreateValetKeyDto): Promise<CreateValetKeyResponse> {
    const { requestedOperations, user } = dto
    const { permissions, uuid } = user

    const permittedOperations = []
    const forbiddenOperations = []

    for (const operation of requestedOperations) {
      if (isOperationPermitted({
        operation,
        permissions,
      })) permittedOperations.push(operation)
      else forbiddenOperations.push(operation)
    }

    // assuming all operations must be permitted to get a valet
    if (permittedOperations.length !== requestedOperations.length) {
      return {
        success: false,
        error: {
          message: `User ${uuid} is not authorized to perform the requested operations.`,
          forbiddenOperations,
        },
      }
    }

    const valetKey: ValetKey = this.valetKeyGenerator.generate({
      uuid, 
      permittedOperations,
    })

    return { success: true, valetKey }
  }
}
