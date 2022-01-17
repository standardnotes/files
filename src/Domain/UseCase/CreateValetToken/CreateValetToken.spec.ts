import 'reflect-metadata'

import { TokenEncoderInterface, ValetTokenData } from '@standardnotes/auth'
import { CreateValetToken } from './CreateValetToken'

describe('CreateValetToken', () => {
  let tokenEncoder: TokenEncoderInterface<ValetTokenData>
  const valetTokenTTL = 123

  const createUseCase = () => new CreateValetToken(tokenEncoder, valetTokenTTL)

  beforeEach(() => {
    tokenEncoder = {} as jest.Mocked<TokenEncoderInterface<ValetTokenData>>
    tokenEncoder.encodeExpirableToken = jest.fn().mockReturnValue('foobar')
  })

  it('should create a read valet token', async () => {
    const response = await createUseCase().execute({
      operation: 'read',
      userUuid: '1-2-3',
      resources: ['1-2-3/2-3-4'],
    })

    expect(response).toEqual({
      success: true,
      valetToken: 'foobar',
    })
  })

  it('should create a write valet token', async () => {
    const response = await createUseCase().execute({
      operation: 'write',
      userUuid: '1-2-3',
    })

    expect(tokenEncoder.encodeExpirableToken).toHaveBeenCalledWith({
      permittedOperation: 'write',
      permittedResources:  [
        expect.any(String),
      ],
      userUuid: '1-2-3',
    }, 123)

    expect(response).toEqual({
      success: true,
      valetToken: 'foobar',
    })
  })
})
