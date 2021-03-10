import { ResourceOperation } from '../Resource/ResourceOperation'

export type UserPermissions = UserPermission[]

export type UserPermission = {
  name: string,
}

// from the API Gateway
export type CreateValetKeyDto = {
  // from auth
  user: {
    uuid: string,
    permissions: UserPermissions,
  },
  // requested by client
  requestedOperations: ResourceOperation[],
}