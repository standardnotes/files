import 'reflect-metadata'
import { Request } from 'express'
import { ValetTokenController } from './ValetTokenController'
import { insufficientPermissionsDto, sufficientPermissionsDto } from '../../Domain/UseCase/CreateValetToken/test/data'
import { CreateValetTokenTest } from '../../Domain/UseCase/CreateValetToken/test/CreateValetToken'
import { CreateValetTokenValidatorTest } from '../../Domain/UseCase/CreateValetToken/test/CreateValetTokenValidatorTest'

describe('ValetKeyController', () => {
  const makeSubject = () => new ValetTokenController(
    CreateValetTokenTest.makeSubject(),
    CreateValetTokenValidatorTest.makeSubject(),
  )

  describe('create', () => {
    it('should fail on bad request', async () => {
      const request = {
        body: {},
      } as jest.Mocked<Request>

      const subject = makeSubject()
  
      const response = await subject.create(request)
      expect(response.statusCode).toEqual(400)
      expect(response.json.success).toEqual(false)
    })

    it('should fail on valid request, but insufficient user permissions', async () => {
      const request = {
        body: insufficientPermissionsDto,
      } as jest.Mocked<Request>
  
      const response = await makeSubject().create(request)
      expect(response.statusCode).toEqual(403)
      expect(response.json.success).toEqual(false)
    })

    it('should succeed on valid request', async () => {
      const request = {
        body: sufficientPermissionsDto,
      } as jest.Mocked<Request>
  
      const response = await makeSubject().create(request)

      expect(response.statusCode).toEqual(200)
      expect(response.json.success).toEqual(true)
    })
  })
})
