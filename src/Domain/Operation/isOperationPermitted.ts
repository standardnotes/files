import { UserPermissions } from '../User/UserWithPermissions'
import { Operation } from './Operation'
import { Resource } from '../Resource/Resource'

// todo: implement based on what auth is capable of returning; + tests
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
  // todo: resource-level granularity
  void resources

  return permissions.includes(operation)
}