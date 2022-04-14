import { injectable } from 'inversify'
import { promises } from 'fs'

import { FileRemoverInterface } from '../../Domain/Services/FileRemoverInterface'
import { RemovedFileDescription } from '../../Domain/File/RemovedFileDescription'

@injectable()
export class FSFileRemover implements FileRemoverInterface {
  async markFilesToBeRemoved(userUuid: string): Promise<Array<RemovedFileDescription>> {
    await promises.rmdir(`${__dirname}/tmp/${userUuid}`)

    return []
  }

  async remove(filePath: string): Promise<number> {
    const fullPath = `${__dirname}/tmp/${filePath}`
    const fileSize = (await promises.stat(fullPath)).size

    await promises.rm(fullPath)

    return fileSize
  }
}
