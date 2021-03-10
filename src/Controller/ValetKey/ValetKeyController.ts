import { inject } from 'inversify'
import { 
  BaseHttpController, 
  controller, 
  httpPost, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  results 
} from 'inversify-express-utils'
import TYPES from '../../Bootstrap/Types'
import { CreateValetKey } from '../../Domain/UseCase/CreateValetKey'
import { Request } from 'express'
import { validateCreateValetKeyRequest } from './validateCreateValetKeyRequest'

@controller('/valetKey')
export class ValetKeyController extends BaseHttpController {
  constructor(
    @inject(TYPES.CreateValetKey) private createValetKey: CreateValetKey,
  ) {
    super()
  }

  @httpPost('/')
  public async create(request: Request): Promise<results.JsonResult> {
    const validatedRequest = validateCreateValetKeyRequest(request)
  
    if (!validatedRequest.success) {
      return this.json(validatedRequest, 400)
    }
  
    const validRequest = validatedRequest.value
    const createValetKeyResponse = await this.createValetKey.execute(validRequest)
  
    if (!createValetKeyResponse.success) {
      return this.json(createValetKeyResponse, 403)
    }
  
    return this.json(createValetKeyResponse)
  }
}
