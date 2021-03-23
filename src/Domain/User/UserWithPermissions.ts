import { UserPermission } from './UserPermission'

export type UserWithPermissions = {
  uuid: string,
  permissions: UserPermission[],
}
