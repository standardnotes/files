export interface FileRemoverInterface {
  remove(filePath: string): Promise<number>
}
