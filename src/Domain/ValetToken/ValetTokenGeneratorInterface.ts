import { ValetPayload } from './ValetPayload'
import { ValetToken } from './ValetToken'

export interface ValetTokenGeneratorInterface {
  fromPayload(payload: ValetPayload): Promise<ValetToken>
  toPayload(token: ValetToken): Promise<ValetPayload | undefined>
}
