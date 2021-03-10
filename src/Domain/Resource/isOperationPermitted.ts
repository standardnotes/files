import { UserPermissions } from '../UseCase/CreateValetKeyDto'
import { ResourceOperation } from './ResourceOperation'

// todo: implement with tests
/**
 * Determines if the given permissions allow executing the requested operation.
 */
export function isOperationPermitted({
  operation, 
  permissions,
}: {
  operation: ResourceOperation, 
  permissions: UserPermissions,
}): boolean {
  void operation, permissions



  return false
}