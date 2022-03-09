import { injectable } from 'inversify'
import { promises } from 'fs'

import { FileRemoverInterface } from '../../Domain/Services/FileRemoverInterface'

@injectable()
export class FSFileRemover implements FileRemoverInterface {
  async remove(filePath: string): Promise<number> {
    const fullPath = `${__dirname}/tmp/${filePath}`
    const fileSize = (await promises.stat(fullPath)).size

    await promises.rm(fullPath)

    return fileSize
  }
}
