export type UserWithPermissions = {
  uuid: string,
  permissions: UserPermissions,
}

export type UserPermissions = UserPermission[]

// todo: agree on what should be returned from auth
export type UserPermission = 'read' | 'write'
