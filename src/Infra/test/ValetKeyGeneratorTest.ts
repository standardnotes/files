import { injectable } from 'inversify'
import { ValetKeyGenerate } from '../../Domain/ValetKey/ValetKeyGenerator'

@injectable()
export class ValetKeyGeneratorTest {
  generate: ValetKeyGenerate = ({
    uuid, 
    permittedOperations,
  }) => {
    return {
      signature: 'badc0ffee',
      userUuid: uuid,
      permittedOperations,
      validityPeriod: {
        date: '2021-03-09T17:30:00Z',
        // 7 days = 7*24*60*60 seconds
        expiresAfterSeconds: 604800,
      }
    }
  }
}