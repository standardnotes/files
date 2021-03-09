import { UserPermissions, UserRoles } from '../UseCase/CreateValetKeyDto'
import { ResourceOperation } from './ResourceOperation'

// todo: implement with tests
/**
 * Determines if the given permissions and roles allow executing the requested operation.
 */
export function isOperationPermitted({
  operation, 
  permissions,
  roles,
}: {
  operation: ResourceOperation, 
  permissions: UserPermissions,
  roles: UserRoles,
}): boolean {
  void operation, permissions, roles
  return false
}