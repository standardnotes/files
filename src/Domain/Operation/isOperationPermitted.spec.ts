import 'reflect-metadata'

import { isOperationPermitted } from './isOperationPermitted'

describe('isOperationPermitted', () => {
  it('should return false for empty permissions', async () => {
    const result = isOperationPermitted({
      permissions: [],
      operation: 'read',
      resources: [{ name: 'file.txt' }],
    })

    expect(result).toEqual(false)
  })
})
