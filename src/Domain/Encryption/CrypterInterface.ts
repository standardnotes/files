export interface CrypterInterface {
  encrypt(value: string, secret: string): Promise<string>
  decrypt(value: string, secret: string): Promise<string | null>
}
