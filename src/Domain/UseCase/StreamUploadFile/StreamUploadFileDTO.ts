import { Request, Response } from 'express'

export type StreamUploadFileDTO = {
  request: Request
  response: Response
}
