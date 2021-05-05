import { UserWithPermissions } from '../../../User/UserWithPermissions'
import { CreateValetKeyDto } from '../CreateValetTokenDto'

const insufficientPermissionsUser = {
  uuid: '00000000-0000-0000-0000-000000000000',
  permissions: [],
}

export const badPermissionsUser = {
  uuid: '00000000-0000-0000-0000-000000000000',
  permissions: ['BAD PERMISSION'],
}

const sufficientPermissionsUser: UserWithPermissions = {
  uuid: '00000000-0000-0000-0000-000000000000',
  permissions: ['read'],
}

export const insufficientPermissionsDto: CreateValetKeyDto = {
  user: insufficientPermissionsUser,
  operation: 'read',
  resources: [{ 'name': 'file.txt' }],
}

export const sufficientPermissionsDto: CreateValetKeyDto = {
  user: sufficientPermissionsUser,
  operation: 'read',
  resources: [{ 'name': 'file.txt' }],
}
