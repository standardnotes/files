import { ResourceOperation } from '../Resource/ResourceOperation'

// todo:
export type UserPermissions = unknown
export type UserRoles = unknown

// from the API Gateway
export type CreateValetKeyDto = {
  // from auth
  user: {
    uuid: string,
    roles: unknown,
    permissions: UserPermissions,
  },
  // requested by client
  requestedOperations: ResourceOperation[],
}