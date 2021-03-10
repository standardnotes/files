import { ValetPayload, ValetStructure } from './ValetToken'
import { GenerateValetToken } from './ValetTokenGenerator'

export const generateValetToken: GenerateValetToken = ({
  uuid, 
  permittedOperation,
  permittedResources,
}) => {
  const payload: ValetPayload = {
    userUuid: uuid,
    permittedOperation,
    permittedResources,
    validityPeriod: {
      date: '2021-03-09T17:30:00Z',
      // 7 days = 7*24*60*60 seconds
      expiresAfterSeconds: 604800,
    }
  }

  const signature = 'todo'

  const structure: ValetStructure = {
    payload,
    signature,
  }

  // todo:
  return JSON.stringify(structure)
}