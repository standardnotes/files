import { UserPermissions } from '../User/UserWithPermissions'
import { Operation } from './Operation'
import { Resource } from '../Resource/Resource'

// todo: implement with tests
/**
 * Determines if the given permissions allow executing the requested operation.
 */
export function isOperationPermitted({
  operation, 
  permissions,
  resources,
}: {
  operation: Operation, 
  permissions: UserPermissions,
  resources: Resource[],
}): boolean {
  void operation, permissions, resources



  return false
}