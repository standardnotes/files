import { ResourceOperation } from '../Resource/ResourceOperation'
import { ValetKey } from '../ValetKey/ValetKey'

export type ErrorResponse = {
  message: string,
  forbiddenOperations: ResourceOperation[],
}

export type CreateValetKeyResponse = {
  success: false,
  error: ErrorResponse,
} | {
  success: true,
  valetKey: ValetKey,
}