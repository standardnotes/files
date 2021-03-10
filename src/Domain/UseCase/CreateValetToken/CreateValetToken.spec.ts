import 'reflect-metadata'

import { CreateValetToken } from './CreateValetToken'

describe('CreateValetKey', () => {
  it('should not create a valet key if an operation is not permitted', async () => {
    const useCase = new CreateValetToken()

    const response = await useCase.execute({
      user: {
        uuid: '123',
        permissions: [],
      },
      operation: 'read',
      resources: [{ name: 'file.txt' }],
    })

    expect(response.success).toEqual(false)
  })
})
