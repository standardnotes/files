import { Container } from 'inversify'
import 'reflect-metadata'
import { ContainerConfigLoader } from '../../../Bootstrap/Container'
import TYPES from '../../../Bootstrap/Types'

import { CreateValetToken } from './CreateValetToken'
import { insufficientPermissionsDto } from './test/data'

// note: possibly describe can't be async and will need to put container init in beforeEach
describe('CreateValetKey', () => {
  let container: Container

  beforeAll(async () => {
    container = await new ContainerConfigLoader().load()
  })

  it('should not create a valet key if an operation is not permitted', async () => {
    const useCase = container.get<CreateValetToken>(TYPES.CreateValetToken)

    const response = await useCase.execute(insufficientPermissionsDto)

    expect(response.success).toEqual(false)
  })
})
