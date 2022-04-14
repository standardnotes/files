export interface FileRemoverInterface {
  remove(filePath: string): Promise<number>
  markFilesToBeRemoved(userUuid: string): Promise<void>
}
