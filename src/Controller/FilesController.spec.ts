import 'reflect-metadata'

import { Request, Response } from 'express'
import { Writable, Readable } from 'stream'
import { StreamUploadFile } from '../Domain/UseCase/StreamUploadFile/StreamUploadFile'
import { FilesController } from './FilesController'
import { StreamDownloadFile } from '../Domain/UseCase/StreamDownloadFile/StreamDownloadFile'

describe('FilesController', () => {
  let streamUploadFile: StreamUploadFile
  let streamDownloadFile: StreamDownloadFile
  let request: Request
  let response: Response
  let writeStream: () => Writable
  let readStream: Readable

  const createController = () => new FilesController(streamUploadFile, streamDownloadFile)

  beforeEach(() => {
    writeStream = () => new Writable()
    streamUploadFile = {} as jest.Mocked<StreamUploadFile>
    streamUploadFile.execute = jest.fn().mockReturnValue({ writeStream })

    readStream = {} as jest.Mocked<Readable>
    readStream.pipe = jest.fn().mockReturnValue(new Writable())
    streamDownloadFile = {} as jest.Mocked<StreamDownloadFile>
    streamDownloadFile.execute = jest.fn().mockReturnValue({ readStream })

    request = {} as jest.Mocked<Request>
    response = {
      locals: {},
    } as jest.Mocked<Response>
    response.locals.userUuid = '1-2-3'
    response.locals.permittedResources = ['2-3-4']
    response.setHeader = jest.fn()
  })

  it('should return a writable stream upon file upload', async () => {
    const result = await createController().upload(request, response)

    expect(result()).toBeInstanceOf(Writable)
  })

  it('should return a writable stream upon file download', async () => {
    const result = await createController().download(request, response)

    expect(result()).toBeInstanceOf(Writable)
  })
})
