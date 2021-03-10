import { ResourceOperation } from '../../Domain/Resource/ResourceOperation'
import { CreateValetKeyDto, UserPermission } from '../../Domain/UseCase/CreateValetKeyDto'
import { InvalidValue, ValidValue } from '../Validation'
import { Request } from 'express'

export function validateCreateValetKeyRequest(request: Request): 
InvalidValue | ValidValue<CreateValetKeyDto> {
  const { body } = request
  const { user, requestedOperations } = body

  if (!user || !Array.isArray(requestedOperations)) return {
    success: false,
    error: 'Request body has missing or invalid properties.'
  }

  const { uuid, permissions } = user

  if (typeof uuid !== 'string' || !Array.isArray(permissions)) return {
    success: false,
    error: 'User has missing or invalid properties.'
  }

  const validatedPermissions = validateUserPermissions(permissions)
  if (!validatedPermissions.success) return validatedPermissions

  const validatedOperations = validateOperations(requestedOperations)
  if (!validatedOperations.success) return validatedOperations

  return {
    success: true,
    value: {
      user: {
        uuid,
        permissions: validatedPermissions.value,
      },
      requestedOperations: validatedOperations.value,
    },
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateUserPermissions(permissions: any[]): 
InvalidValue | ValidValue<UserPermission[]> {
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
function validateOperations(operations: any[]): 
InvalidValue | ValidValue<ResourceOperation[]> {
  const validOperations = []
  for (const resourceOperation of operations) {
    const { resource, operation } =  resourceOperation
    if (!['read', 'write'].includes(operation)) return {
      success: false,
      error: 'At least one operation is missing or invalid.'
    }
    const { name } = resource
    if (typeof name !== 'string') return {
      success: false,
      error: 'At least one resource name is missing or invalid.'
    }
    validOperations.push({ resource, operation })
  }

  return { success: true, value: validOperations }
}