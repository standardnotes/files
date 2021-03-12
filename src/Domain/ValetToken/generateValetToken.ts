import { ValetPayload, ValetToken } from './ValetToken'
import { ValetTokenSecret, GenerateValetToken, JwtSecret } from './ValetTokenGenerator'
import { sign, verify } from 'jsonwebtoken'
import dayjs = require('dayjs')
import { dateFormat, defaultExpiresAfterSeconds } from './constants'
import { CrypterSncrypto } from '../Encryption/CrypterSncrypto'

export const generateValetToken: GenerateValetToken = async ({
  uuid, 
  permittedOperation,
  permittedResources,
  validityPeriod: optValidityPeriod,
  jwtSecret,
  valetTokenSecret,
  crypter,
}) => {
  const defaultPeriod = {
    // valid from current date
    date: dayjs().format(dateFormat),
    expiresAfterSeconds: defaultExpiresAfterSeconds,
  }

  const { date, expiresAfterSeconds } = optValidityPeriod || defaultPeriod

  const validityPeriod = {
    date: date === undefined? defaultPeriod.date: date,
    expiresAfterSeconds: expiresAfterSeconds === undefined?
      defaultPeriod.expiresAfterSeconds: 
      expiresAfterSeconds,
  }

  const payload: ValetPayload = {
    userUuid: uuid,
    permittedOperation,
    permittedResources,
    validityPeriod,
  }

  const jwt = valetPayloadToJwt(payload, jwtSecret)

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
  crypter: CrypterSncrypto,
}): Promise<ValetPayload> => {
  const jwt = await crypter.decrypt(token, valetTokenSecret)

  if (jwt === null) throw Error('Could not decrypt the valet token!')

  const payloadString = verify(jwt, jwtSecret, { algorithms: ['HS256'] }) as string

  return JSON.parse(payloadString)
}

function valetPayloadToJwt(payload: ValetPayload, jwtSecret: JwtSecret): string {
  // const valuesSortedByKey = Object.entries(payload)
  //   .sort(([ka], [kb]) => ka.localeCompare(kb))
  //   .map(([, v]) => v)

  const payloadString = JSON.stringify(payload)

  return sign(payloadString, jwtSecret, { algorithm: 'HS256' })
}