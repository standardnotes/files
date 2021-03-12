import 'reflect-metadata'
import { ContainerConfigLoader } from '../../../Bootstrap/Container'

import { CreateValetToken } from './CreateValetToken'
import { validDto } from './CreateValetToken.data.spec'

// todo: implement after solving the sncrypto-web issue
// note: possibly describe can't be async and will need to put container init in beforeEach
describe('CreateValetKey', async () => {
  const container = await new ContainerConfigLoader().load()

  it('should not create a valet key if an operation is not permitted', async () => {
    const useCase = container.get(CreateValetToken)

    const response = await useCase.execute(validDto)

    expect(response.success).toEqual(false)
  })
})
