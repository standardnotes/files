import { CreateValetKeyDto } from './CreateValetTokenDto'

export const validDto: CreateValetKeyDto = {
  user: {
    uuid: '123',
    permissions: []
  },
  operation: 'read',
  resources: [{ 'name': 'file.txt' }]
}