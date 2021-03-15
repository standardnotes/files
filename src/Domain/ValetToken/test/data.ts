import { ValetPayload } from '../ValetToken'

export const valetPayload: ValetPayload = {
  userUuid: '00000000-0000-0000-0000-000000000000',
  permittedOperation: 'read',
  permittedResources: [ { name: 'file.txt' } ],
  validityPeriod: { date: '2021-03-15T18:13:48Z', expiresAfterSeconds: 7200 }
}