export type EncryptedString = string
export interface CrypterInterface {
  /**
   * Encrypts `plaintext` with `secretKey`.
   * @param plaintext in utf-8
   * @param secretKey in utf-8
   */
  encrypt(plaintext: string, secretKey: string): Promise<EncryptedString>
  /**
   * Decrypts `encryptedString` with `secretKey`.
   * @param encryptedString returned by CrypterInterface::encrypt
   * @param secretKey in utf-8
   */
  decrypt(encryptedString: EncryptedString, secretKey: string): Promise<string>
}
