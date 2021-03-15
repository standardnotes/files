import 'reflect-metadata'
import { Request } from 'express'
import { ContainerConfigLoader } from '../../Bootstrap/Container'

import { ValetTokenController } from './ValetTokenController'
import { Container } from 'inversify'
import TYPES from '../../Bootstrap/Types'
import { CreateValetToken } from '../../Domain/UseCase/CreateValetToken/CreateValetToken'
import { insufficientPermissionsDto, sufficientPermissionsDto } from '../../Domain/UseCase/CreateValetToken/test/data'

describe('ValetKeyController', () => {
  let container: Container

  const createController = () => new ValetTokenController(
    container.get<CreateValetToken>(TYPES.CreateValetToken)
  )

  beforeAll(async () => {
    container = await new ContainerConfigLoader().load()
  })

  describe('create', () => {
    it('should fail on bad request', async () => {
      const request = {
        body: {},
      } as jest.Mocked<Request>
  
      const response = await createController().create(request)
      expect(response.statusCode).toEqual(400)
      expect(response.json.success).toEqual(false)
    })

    it('should fail on valid request, but insufficient user permissions', async () => {
      const request = {
        body: insufficientPermissionsDto,
      } as jest.Mocked<Request>
  
      const response = await createController().create(request)
      expect(response.statusCode).toEqual(403)
      expect(response.json.success).toEqual(false)
    })

    it('should succeed on valid request', async () => {
      const request = {
        body: sufficientPermissionsDto,
      } as jest.Mocked<Request>
  
      const response = await createController().create(request)

      expect(response.statusCode).toEqual(200)
      expect(response.json.success).toEqual(true)
    })
  })
})
