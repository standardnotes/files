import { inject } from 'inversify'
import { 
  BaseHttpController, 
  controller, 
  httpPost, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  results,
} from 'inversify-express-utils'
import TYPES from '../../Bootstrap/Types'
import { CreateValetToken } from '../../Domain/UseCase/CreateValetToken/CreateValetToken'
import { Request } from 'express'
import { validateCreateValetTokenRequest } from '../../Domain/UseCase/CreateValetToken/CreateValetTokenValidation'

@controller('/valetToken')
export class ValetTokenController extends BaseHttpController {
  constructor(
    @inject(TYPES.CreateValetToken) private createValetKey: CreateValetToken,
  ) {
    super()
  }

  @httpPost('/')
  public async create(request: Request): Promise<results.JsonResult> {
    const validatedRequest = validateCreateValetTokenRequest(request)
  
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
