import 'reflect-metadata'

import { CrypterStub } from '../Encryption/test/CrypterStub'
import { jwtSecret, valetPayload, valetTokenSecret } from './test/data'
import { ValetTokenGenerator } from './ValetTokenGenerator'

describe('ValetTokenGenerator', () => {
  function makeSubject({ valetSecret = valetTokenSecret } = {}) {
    return new ValetTokenGenerator(
      new CrypterStub(),
      jwtSecret,
      valetSecret,
    )
  }

  it('generateValetToken should succeed on valid body', async () => {
    const output = await makeSubject().generateValetToken(valetPayload)

    expect(output.endsWith(`:${valetTokenSecret}`)).toEqual(true)
  })

  describe('valetTokenToPayload', () => {
    it('should succeed on valid body', async () => {
      const token = `eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyVXVpZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCIsInBlcm1pdHRlZE9wZXJhdGlvbiI6InJlYWQiLCJwZXJtaXR0ZWRSZXNvdXJjZXMiOlt7Im5hbWUiOiJmaWxlLnR4dCJ9XSwidmFsaWRpdHlQZXJpb2QiOnsiZGF0ZSI6IjIwMjEtMDMtMTVUMTg6MTM6NDhaIiwiZXhwaXJlc0FmdGVyU2Vjb25kcyI6NzIwMH19.FCirQ803aPoImzl1FdJFGgNjZxhPYEBAGPmKd6h74d4:${valetTokenSecret}`
      const output = await makeSubject().valetTokenToPayload(token)
  
      expect(output).toEqual(valetPayload)
    })
    it('should fail on bad secret', async () => {
      const token = `token:${valetTokenSecret}`
  
      await expect(
        makeSubject({ valetSecret: 'BAD' }).valetTokenToPayload(token)
      ).rejects.toThrow()
    })
  })
})
