import 'reflect-metadata'

import { CreateUploadSession } from '../Domain/UseCase/CreateUploadSession/CreateUploadSession'
import { FinishUploadSession } from '../Domain/UseCase/FinishUploadSession/FinishUploadSession'
import { StreamDownloadFile } from '../Domain/UseCase/StreamDownloadFile/StreamDownloadFile'
import { UploadFileChunk } from '../Domain/UseCase/UploadFileChunk/UploadFileChunk'

import { Request, Response } from 'express'
import { Writable, Readable } from 'stream'
import { FilesController } from './FilesController'

describe('FilesController', () => {
  let uploadFileChunk: UploadFileChunk
  let createUploadSession: CreateUploadSession
  let finishUploadSession: FinishUploadSession
  let streamDownloadFile: StreamDownloadFile
  let request: Request
  let response: Response
  let readStream: Readable

  const createController = () => new FilesController(
    uploadFileChunk,
    createUploadSession,
    finishUploadSession,
    streamDownloadFile,
  )

  beforeEach(() => {
    readStream = {} as jest.Mocked<Readable>
    readStream.pipe = jest.fn().mockReturnValue(new Writable())

    streamDownloadFile = {} as jest.Mocked<StreamDownloadFile>
    streamDownloadFile.execute = jest.fn().mockReturnValue({ readStream })

    uploadFileChunk = {} as jest.Mocked<UploadFileChunk>
    uploadFileChunk.execute = jest.fn().mockReturnValue({ success: true })

    createUploadSession = {} as jest.Mocked<CreateUploadSession>
    createUploadSession.execute = jest.fn().mockReturnValue({ success: true, uploadId: '123' })

    finishUploadSession = {} as jest.Mocked<FinishUploadSession>
    finishUploadSession.execute = jest.fn().mockReturnValue({ success: true })

    request = {
      body: {},
      headers: {},
    } as jest.Mocked<Request>
    response = {
      locals: {},
    } as jest.Mocked<Response>
    response.locals.userUuid = '1-2-3'
    response.locals.permittedResources = ['2-3-4']
    response.setHeader = jest.fn()
  })

  it('should return a writable stream upon file download', async () => {
    const result = await createController().download(request, response)

    expect(result()).toBeInstanceOf(Writable)
  })

  it('should create an upload session', async () => {
    await createController().startUpload(request, response)

    expect(createUploadSession.execute).toHaveBeenCalledWith({
      resource: '2-3-4',
      userUuid: '1-2-3',
    })
  })

  it('should return bad request if upload session could not be created', async () => {
    createUploadSession.execute = jest.fn().mockReturnValue({ success: false })

    const httpResponse = await createController().startUpload(request, response)
    const result = await httpResponse.executeAsync()

    expect(result.statusCode).toEqual(400)
  })

  it('should finish an upload session', async () => {
    await createController().finishUpload(request, response)

    expect(finishUploadSession.execute).toHaveBeenCalledWith({
      resource: '2-3-4',
      userUuid: '1-2-3',
    })
  })

  it('should return bad request if upload session could not be finished', async () => {
    finishUploadSession.execute = jest.fn().mockReturnValue({ success: false })

    const httpResponse = await createController().finishUpload(request, response)
    const result = await httpResponse.executeAsync()

    expect(result.statusCode).toEqual(400)
  })

  it('should upload a chunk to an upload session', async () => {
    request.body.chunkId = 2
    request.body.chunk = new Uint8Array([123])

    await createController().uploadChunk(request, response)

    expect(uploadFileChunk.execute).toHaveBeenCalledWith({
      chunkId: 2,
      data: new Uint8Array([123]),
      resource: '2-3-4',
      userUuid: '1-2-3',
    })
  })

  it('should return bad request if chunk could not be uploaded', async () => {
    request.body.chunkId = 2
    request.body.chunk = new Uint8Array([123])
    uploadFileChunk.execute = jest.fn().mockReturnValue({ success: false })

    const httpResponse = await createController().uploadChunk(request, response)
    const result = await httpResponse.executeAsync()

    expect(result.statusCode).toEqual(400)
  })

  it('should return bad request if chunk id is missing', async () => {
    request.body.chunk = new Uint8Array([123])

    const httpResponse = await createController().uploadChunk(request, response)
    const result = await httpResponse.executeAsync()

    expect(result.statusCode).toEqual(400)
  })

  it('should return bad request if chunk is missing', async () => {
    request.body.chunkId = 2

    const httpResponse = await createController().uploadChunk(request, response)
    const result = await httpResponse.executeAsync()

    expect(result.statusCode).toEqual(400)
  })
})
