import { ValetPayload, ValetToken } from './ValetToken'
import { ValetTokenSecret, GenerateValetToken, JwtSecret } from './ValetTokenGenerator'
import { sign, verify } from 'jsonwebtoken'
import { CrypterInterface } from '../Encryption/CrypterInterface'

export const generateValetToken: GenerateValetToken = async ({
  payload,
  jwtSecret,
  valetTokenSecret,
  crypter,
}) => {
  const jwt = sign(JSON.stringify(payload), jwtSecret, { algorithm: 'HS256' })

  return crypter.encrypt(jwt, valetTokenSecret)
}

export const valetTokenToPayload = async ({
  token, 
  jwtSecret, 
  valetTokenSecret,
  crypter,
}: {
  token: ValetToken, 
  jwtSecret: JwtSecret, 
  valetTokenSecret: ValetTokenSecret,
  crypter: CrypterInterface,
}): Promise<ValetPayload> => {
  const jwt = await crypter.decrypt(token, valetTokenSecret)

  if (jwt === null) throw Error('Could not decrypt the valet token!')

  const payload = verify(jwt, jwtSecret, { algorithms: ['HS256'] }) as ValetPayload

  return payload
}