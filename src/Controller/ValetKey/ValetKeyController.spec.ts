import 'reflect-metadata'
import { CreateValetKey } from '../../Domain/UseCase/CreateValetKey'
import { ValetKeyGeneratorTest } from '../../Infra/test/ValetKeyGeneratorTest'
import { Request } from 'express'

import { ValetKeyController } from './ValetKeyController'

describe('ValetKeyController', () => {
  const createController = () => new ValetKeyController(
    new CreateValetKey(
      new ValetKeyGeneratorTest()
    )
  )

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
