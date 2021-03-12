import 'reflect-metadata'
import { ContainerConfigLoader } from '../../Bootstrap/Container'
import { CrypterSncrypto } from './CrypterSncrypto'

// todo: after sncrypto-web issue fixed
describe('CrypterSncrypto', async () => {
  const container = await new ContainerConfigLoader().load()
  
  it('should not create a valet key if an operation is not permitted', async () => {
    const crypter = container.get(CrypterSncrypto)

    const encrypted = await crypter.encrypt('aaa', 'bbb')

    expect(encrypted).not.toEqual('aaa')
  })
})
