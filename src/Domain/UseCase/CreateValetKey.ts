import { injectable } from 'inversify'
import { ResourceOperation } from '../Resource/ResourceOperation'
import { Uuid, ValetKey } from '../ValetKey/ValetKey'
import { CreateValetKeyDto, UserPermissions, UserRoles } from './CreateValetKeyDto'
import { CreateValetKeyResponse } from './CreateValetKeyResponse'
import { UseCaseInterface } from './UseCaseInterface'

@injectable()
export class CreateValetKey implements UseCaseInterface {
  constructor() {
    void 'todo'
  }

  /**
   * Given a request from the API Gateway containing auth data for a user and the requested file operations generates a valet key which can be used to perform these operations directly via the Files Service.
   */
  async execute(dto: CreateValetKeyDto): Promise<CreateValetKeyResponse> {
    const { requestedOperations, user } = dto
    const { permissions, roles, uuid } = user

    const permittedOperations = []
    const forbiddenOperations = []

    for (const operation of requestedOperations) {
      if (this.isOperationPermitted({
        operation, 
        roles,
        permissions,
      })) permittedOperations.push(operation)
      else forbiddenOperations.push(operation)
    }

    // assuming all operations must be permitted to get a key
    if (permittedOperations.length !== requestedOperations.length) {
      return {
        success: false,
        error: {
          message: `User ${uuid} is not authorized to perform the requested operations.`,
          forbiddenOperations,
        },
      }
    }

    const valetKey: ValetKey = this.generateValetKey({
      uuid, 
      permittedOperations,
    })

    return { success: true, valetKey }
  }

  // todo:
  /**
   * Generates a valet key for given user `uuid` that allows them to perform the `permittedOperations` on the data store.
   */
  generateValetKey({
    uuid, 
    permittedOperations,
  }: {
    uuid: Uuid, 
    permittedOperations: ResourceOperation[],
  }): ValetKey {
    return {
      signature: 'badc0ffee',
      userUuid: uuid,
      permittedOperations,
      validityPeriod: {
        date: '2021-03-09T17:30:00Z',
        // 7 days = 7*24*60*60 seconds
        expiresAfterSeconds: 604800,
      }
    }
  }

  // todo?: extract
  /**
   * Determines if the given permissions and roles allow executing the requested operation.
   */
  isOperationPermitted({
    operation, 
    permissions,
    roles,
  }: {
    operation: ResourceOperation, 
    permissions: UserPermissions,
    roles: UserRoles,
  }): boolean {
    // todo: 
    void operation, permissions, roles
    return false
  }
}
