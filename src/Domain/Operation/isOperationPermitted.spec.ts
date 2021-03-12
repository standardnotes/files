import 'reflect-metadata'

import { isOperationPermitted } from './isOperationPermitted'

describe('isOperationPermitted', () => {
  it('should return true for sufficient permissions', async () => {
    const result = isOperationPermitted({
      permissions: ['read', 'write'],
      operation: 'read',
      resources: [{ name: 'file.txt' }],
    })

    expect(result).toEqual(true)
  })
  it('should return false for empty permissions', async () => {
    const result = isOperationPermitted({
      permissions: [],
      operation: 'read',
      resources: [{ name: 'file.txt' }],
    })

    expect(result).toEqual(false)
  })
  it('should return false for insufficient permissions', async () => {
    const result = isOperationPermitted({
      permissions: ['write'],
      operation: 'read',
      resources: [{ name: 'file.txt' }],
    })

    expect(result).toEqual(false)
  })
})
