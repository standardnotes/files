import { CreateValetKeyDto } from './CreateValetTokenDto'
import { ValidatedValue } from '../../Validation/Validation'
import { Request } from 'express'
import { Operation } from '../../Operation/Operation'
import { Resource } from '../../Resource/Resource'
import { validateUuid } from '../../Uuid/validateUuid'
import { UserPermissions, UserWithPermissions } from '../../User/UserWithPermissions'

export function validateCreateValetTokenRequest(request: Request): 
ValidatedValue<CreateValetKeyDto> {
  const { body } = request

  console.log('body', body)

  const json = body
  // try {
  //   json = JSON.parse(body)
  // } catch (e) {
  //   return {
  //     success: false,
  //     error: `Request body ${JSON.stringify(body)} can't be parsed: ${e.message}`
  //   }
  // }
  const { user, operation, resources } = json

  if (!user || !Array.isArray(resources)) return {
    success: false,
    error: `Request body ${JSON.stringify(body)} has missing or invalid properties.`,
  }

  const validatedUser = validateUser(user)
  if (!validatedUser.success) return validatedUser

  const validatedOperation = validateOperation(operation)
  if (!validatedOperation.success) return validatedOperation

  const validatedResources = validateResources(resources)
  if (!validatedResources.success) return validatedResources

  return {
    success: true,
    value: {
      user: validatedUser.value,
      operation: validatedOperation.value,
      resources: validatedResources.value,
    },
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateUser(user: any):
ValidatedValue<UserWithPermissions> {
  if (!user) return {
    success: false,
    error: 'User is missing or invalid.'
  }
  const { uuid, permissions } = user

  const validatedUuid = validateUuid(uuid)
  if (!validatedUuid.success) return validatedUuid

  const validatedPermissions = validateUserPermissions(permissions)
  if (!validatedPermissions.success) return validatedPermissions

  const validUuid = uuid

  return {
    success: true,
    value: {
      uuid: validUuid,
      permissions: validatedPermissions.value,
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateUserPermissions(permissions: any): 
ValidatedValue<UserPermissions> {
  if (!Array.isArray(permissions)) return {
    success: false,
    error: 'User permissions must be an array.'
  }

  const validPermissions = []
  for (const permission of permissions) {
    const { name } = permission
    if (typeof name !== 'string') return {
      success: false,
      error: 'At least one user permission has missing or invalid properties.'
    }
    validPermissions.push({ name })
  }

  return { success: true, value: validPermissions }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateOperation(operation: any): 
ValidatedValue<Operation> {
  if (!['read', 'write'].includes(operation)) return {
    success: false,
    error: 'Operation is missing or invalid.'
  }

  return { success: true, value: operation }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateResources(resources: any[]): 
ValidatedValue<Resource[]> {
  const validResources = []
  for (const resource of resources) {
    const { name } = resource
    if (typeof name !== 'string') return {
      success: false,
      error: 'At least one resource name is missing or invalid.'
    }
    validResources.push({ name })
  }

  return { success: true, value: validResources }
}