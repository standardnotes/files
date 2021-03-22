import { CreateValetKeyDto } from './CreateValetTokenDto'
import { ValidatedValue } from '../../Validation/Validation'
import { Request } from 'express'
import { Operation } from '../../Operation/Operation'
import { Resource } from '../../Resource/Resource'
import { validateUuid } from '../../Uuid/validateUuid'
import { UserPermission, UserWithPermissions } from '../../User/UserWithPermissions'
import { ValidityPeriod } from '../../ValetToken/ValetToken'
import { dateFormat, maxExpiresAfterSeconds, minExpiresAfterSeconds } from '../../ValetToken/ValetToken'
import { validateDateString } from '../../Date/validateDateString'

/**
 * Assuming `request` contains a JS object in the `body`, parsed as JSON.
 */
export function validateCreateValetTokenRequest(request: Request): 
ValidatedValue<CreateValetKeyDto> {
  const { body } = request
  const { user, operation, resources, validityPeriod } = body

  const validatedUser = validateUser(user)
  if (!validatedUser.success) return validatedUser

  const validatedOperation = validateOperation(operation)
  if (!validatedOperation.success) return validatedOperation

  const validatedResources = validateResources(resources)
  if (!validatedResources.success) return validatedResources

  const validatedPeriod = validatePeriod(validityPeriod)
  if (!validatedPeriod.success) return validatedPeriod

  return {
    success: true,
    value: {
      user: validatedUser.value,
      operation: validatedOperation.value,
      resources: validatedResources.value,
      validityPeriod: validatedPeriod.value,
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function validateUserPermissions(permissions: any): 
ValidatedValue<UserPermission[]> {
  if (!Array.isArray(permissions)) return {
    success: false,
    error: 'User permissions must be an array.'
  }

  const validPermissions: UserPermission[] = []
  for (const permission of permissions) {
    if (
      typeof permission !== 'string' || 
      !['read', 'write'].includes(permission)
    ) return {
      success: false,
      error: 'At least one user permission is invalid.'
    }
    validPermissions.push(permission as UserPermission)
  }

  return { success: true, value: validPermissions }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function validateOperation(operation: any): 
ValidatedValue<Operation> {
  if (!['read', 'write'].includes(operation)) return {
    success: false,
    error: 'Operation is missing or invalid.'
  }

  return { success: true, value: operation }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateResources(resources: any): 
ValidatedValue<Resource[]> {
  if (!Array.isArray(resources)) return {
    success: false,
    error: 'Resources are missing or invalid.'
  }

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validatePeriod(period: any): 
ValidatedValue<Partial<ValidityPeriod>> {
  if (period === undefined) return { success: true, value: period }

  const { date, expiresAfterSeconds } = period

  const validPeriod: Partial<ValidityPeriod> = {}

  if (date !== undefined) {
    const validatedDate = validateDateString(date, dateFormat)
    if (!validatedDate.success) return validatedDate

    validPeriod.date = validatedDate.value
  }
  if (expiresAfterSeconds !== undefined) {
    const validatedExpires = validateExpiresAfterSeconds(expiresAfterSeconds)
    if (!validatedExpires.success) return validatedExpires

    validPeriod.expiresAfterSeconds = validatedExpires.value
  }

  return { success: true, value: validPeriod }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateExpiresAfterSeconds(expires: any): ValidatedValue<number> {
  if (typeof expires !== 'number') return {
    success: false,
    error: 'expiresAfterSeconds is missing or invalid.'
  }

  if (expires > maxExpiresAfterSeconds || expires < minExpiresAfterSeconds) return {
    success: false,
    error: `expiresAfterSeconds must be in the inclusive range ${minExpiresAfterSeconds}..${maxExpiresAfterSeconds}.`
  }

  return {
    success: true,
    value: expires,
  }
}
