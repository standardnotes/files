import { CrypterStub } from '../../Encryption/test/CrypterStub'
import { ValetTokenGenerator } from '../ValetTokenGenerator'
import { jwtSecret, valetTokenSecret } from './data'

export class ValetTokenGeneratorTest {
  public static makeSubject(): ValetTokenGenerator {
    return new ValetTokenGenerator(
      new CrypterStub(),
      jwtSecret,
      valetTokenSecret,
    )
  }
}
