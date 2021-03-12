import 'reflect-metadata'

import { CrypterTest } from '../Encryption/CrypterTest.spec'
import { generateValetToken } from './generateValetToken'

// todo: more comprehensive
describe('generateValetToken', () => {
  it('should succeed on valid body', async () => {
    const valetTokenSecret = '456'
    const output = await generateValetToken({
      crypter: new CrypterTest(),
      jwtSecret: '123',
      valetTokenSecret,
      permittedOperation: 'read',
      permittedResources: [{ name: 'file.txt' }],
      uuid: 'abc',
      validityPeriod: {},
    })

    expect(output.endsWith(`:${valetTokenSecret}`)).toEqual(true)
  })
})
