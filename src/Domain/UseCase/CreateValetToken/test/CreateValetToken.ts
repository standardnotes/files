import { OperationValidator } from '../../../Operation/OperationValidator'
import { ValetTokenGeneratorTest } from '../../../ValetToken/test/ValetTokenGeneratorTest'
import { ValetPayloadGenerator } from '../../../ValetToken/ValetPayloadGenerator'
import { CreateValetToken } from '../CreateValetToken'

export class CreateValetTokenTest {
  public static makeSubject(): CreateValetToken {
    return new CreateValetToken(
      new OperationValidator(),
      new ValetPayloadGenerator(),
      ValetTokenGeneratorTest.makeSubject(),
    )
  }
}
