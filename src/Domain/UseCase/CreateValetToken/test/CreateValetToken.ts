import { CrypterStub } from '../../../Encryption/test/CrypterStub'
import { jwtSecret, valetTokenSecret } from '../../../ValetToken/test/data'
import { CreateValetToken } from '../CreateValetToken'

export class CreateValetTokenTest {
  public static makeSubject(): CreateValetToken {
    return new CreateValetToken(
      jwtSecret,
      valetTokenSecret,
      new CrypterStub(),
    )
  }
}
