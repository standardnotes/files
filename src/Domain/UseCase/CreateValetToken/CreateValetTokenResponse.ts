import { ValetToken } from '../../ValetToken/ValetToken'
import { CreateValetTokenError } from './CreateValetTokenError'

export type CreateValetTokenResponse = {
  success: false,
  error: CreateValetTokenError,
} | {
  success: true,
  valetToken: ValetToken,
}
