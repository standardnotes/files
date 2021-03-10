import 'reflect-metadata'

import { isOperationPermitted } from './isOperationPermitted'

describe('isOperationPermitted', () => {
  it('should return false for empty permissions', async () => {
    const result = isOperationPermitted({
      permissions: [],
      operation: { 
        operation: 'read', 
        resource: { name: 'file.txt' },
      }
    })

    expect(result).toEqual(false)
  })
})
