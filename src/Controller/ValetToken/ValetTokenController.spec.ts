import 'reflect-metadata'
// import { CreateValetToken } from '../../Domain/UseCase/CreateValetToken/CreateValetToken'
import { Request } from 'express'
import { ContainerConfigLoader } from '../../Bootstrap/Container'

import { ValetTokenController } from './ValetTokenController'

describe('ValetKeyController', async () => {
  const container = await new ContainerConfigLoader().load()
  const createController = () => container.get(ValetTokenController)

  describe('create', () => {
    it('should fail on bad request', async () => {
      const request = {
        body: {},
      } as jest.Mocked<Request>
  
      const response = await createController().create(request)
      expect(response.statusCode).toEqual(400)
      expect(response.json).toEqual({ success: false, error: 'Request body has missing or invalid properties.' })
    })
  })
})
