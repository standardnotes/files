import { Operation } from '../../Operation/Operation'
import { ValetToken } from '../../ValetToken/ValetToken'

export type CreateValetKeyResponse = {
  success: false,
  error: ErrorResponse,
} | {
  success: true,
  valetToken: ValetToken,
}

export type ErrorResponse = {
  message: string,
  forbiddenOperation: Operation,
}
