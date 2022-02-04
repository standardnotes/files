import { ChunkId } from './ChunkId'

export type UploadChunkResult = {
  PartNumber: ChunkId
  ETag: string
}
