export type EncryptedString = string
export interface CrypterInterface {
  /**
   * Expects parameters in utf-8.
   */
  encrypt(plaintext: string, secretKey: string): Promise<EncryptedString>
  /**
   * Decrypts `encryptedString` with `secretKey`.
   * @param encryptedString returned by CrypterInterface::encrypt
   * @param secretKey in utf-8
   */
  decrypt(encryptedString: EncryptedString, secretKey: string): Promise<string>
}
