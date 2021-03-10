export type InvalidValue = { success: false, error: string }
export type ValidValue<T> = { success: true, value: T }