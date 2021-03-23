import { Operation } from '../../Operation/Operation'

export type CreateValetTokenError = {
  message: string,
  forbiddenOperation: Operation,
}
