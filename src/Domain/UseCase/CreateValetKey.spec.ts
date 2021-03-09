import 'reflect-metadata'

import { CreateValetKey } from './CreateValetKey'

describe('CreateValetKey', () => {
  const createUseCase = () => new CreateValetKey()

  beforeEach(() => {
    void 'todo'
  })

  it('should not create a valet key if an operation is not permitted', async () => {
    const useCase = createUseCase()

    const response = await useCase.execute({
      user: {
        uuid: '123',
        permissions: [],
        roles: [],
      },
      requestedOperations: [{ 
        operation: 'read', 
        resource: { name: 'file.txt' },
      }]
    })

    expect(response.success).toEqual(false)
  })
})
