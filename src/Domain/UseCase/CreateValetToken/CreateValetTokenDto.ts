import { Operation } from '../../Operation/Operation'
import { Resource } from '../../Resource/Resource'
import { UserWithPermissions } from '../../User/UserWithPermissions'

// from the API Gateway
export type CreateValetKeyDto = {
  // from auth
  user: UserWithPermissions,
  // requested by client
  operation: Operation,
  resources: Resource[],
}