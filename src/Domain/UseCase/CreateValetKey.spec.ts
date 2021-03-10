import 'reflect-metadata'
import { ValetKeyGeneratorTest } from '../../Infra/test/ValetKeyGeneratorTest'

import { CreateValetKey } from './CreateValetKey'

describe('CreateValetKey', () => {
  it('should not create a valet key if an operation is not permitted', async () => {
    const useCase = new CreateValetKey(new ValetKeyGeneratorTest())

    const response = await useCase.execute({
      user: {
        uuid: '123',
        permissions: [],
      },
      requestedOperations: [{ 
        operation: 'read', 
        resource: { name: 'file.txt' },
      }]
    })

    expect(response.success).toEqual(false)
  })
})
