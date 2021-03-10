export type UserWithPermissions = {
  uuid: string,
  permissions: UserPermissions,
}

export type UserPermissions = UserPermission[]

export type UserPermission = {
  name: string,
}
