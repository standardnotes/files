import { InvalidValue } from './InvalidValue'
import { ValidValue } from './ValidValue'

export type ValidatedValue<T> = InvalidValue | ValidValue<T>
