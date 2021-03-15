import 'reflect-metadata'

import { CrypterTest } from '../Encryption/test/CrypterTest'
import { generateValetToken, valetTokenToPayload } from './generateValetToken'
import { valetPayload } from './test/data'

const jwtSecret = '123'
const valetTokenSecret = '456'

describe('generateValetToken', () => {
  it('should succeed on valid body', async () => {
    const output = await generateValetToken({
      crypter: new CrypterTest(),
      jwtSecret,
      valetTokenSecret,
      payload: valetPayload,
    })

    expect(output.endsWith(`:${valetTokenSecret}`)).toEqual(true)
  })
})

describe('valetTokenToPayload', () => {
  it('should succeed on valid body', async () => {
    const token = `eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyVXVpZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCIsInBlcm1pdHRlZE9wZXJhdGlvbiI6InJlYWQiLCJwZXJtaXR0ZWRSZXNvdXJjZXMiOlt7Im5hbWUiOiJmaWxlLnR4dCJ9XSwidmFsaWRpdHlQZXJpb2QiOnsiZGF0ZSI6IjIwMjEtMDMtMTVUMTg6MTM6NDhaIiwiZXhwaXJlc0FmdGVyU2Vjb25kcyI6NzIwMH19.FCirQ803aPoImzl1FdJFGgNjZxhPYEBAGPmKd6h74d4:${valetTokenSecret}`
    const output = await valetTokenToPayload({
      token,
      jwtSecret,
      valetTokenSecret,
      crypter: new CrypterTest(),
    })

    expect(output).toEqual(valetPayload)
  })
  it('should fail on bad secret', async () => {
    const token = `token:${valetTokenSecret}`

    await expect(valetTokenToPayload({
      token,
      jwtSecret,
      valetTokenSecret: 'BAD',
      crypter: new CrypterTest(),
    })).rejects.toThrow()
  })
})