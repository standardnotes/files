import { DateValidator } from '../../../Date/DateValidator'
import { UuidValidator } from '../../../Uuid/UuidValidator'
import { CreateValetTokenValidator } from '../CreateValetTokenValidator'

export class CreateValetTokenValidatorTest {
  public static makeSubject(): CreateValetTokenValidator {
    return new CreateValetTokenValidator(
      new DateValidator(),
      new UuidValidator(),
    )
  }
}
