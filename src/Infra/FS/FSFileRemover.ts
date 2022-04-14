import { injectable } from 'inversify'
import { promises } from 'fs'

import { FileRemoverInterface } from '../../Domain/Services/FileRemoverInterface'

@injectable()
export class FSFileRemover implements FileRemoverInterface {
  async markFilesToBeRemoved(userUuid: string): Promise<void> {
    await promises.rmdir(`${__dirname}/tmp/${userUuid}`)
  }

  async remove(filePath: string): Promise<number> {
    const fullPath = `${__dirname}/tmp/${filePath}`
    const fileSize = (await promises.stat(fullPath)).size

    await promises.rm(fullPath)

    return fileSize
  }
}
