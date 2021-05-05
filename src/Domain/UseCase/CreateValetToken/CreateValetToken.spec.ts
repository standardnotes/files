import 'reflect-metadata'
import { CreateValetTokenTest } from './test/CreateValetToken'
import { insufficientPermissionsDto } from './test/data'

describe('CreateValetKey', () => {
  it('should not create a valet key if an operation is not permitted', async () => {
    const useCase = CreateValetTokenTest.makeSubject()

    const response = await useCase.execute(insufficientPermissionsDto)

    expect(response.success).toEqual(false)
  })
})
