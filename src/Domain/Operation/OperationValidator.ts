import 'reflect-metadata'
import { injectable } from 'inversify'
import { Resource } from '../Resource/Resource'
import { UserPermission } from '../User/UserPermission'
import { Operation } from './Operation'

@injectable()
export class OperationValidator {
  isOperationPermitted = ({
    operation, 
    permissions,
    resources,
  }: {
    operation: Operation, 
    permissions: UserPermission[],
    resources: Resource[],
  }): boolean => {
    void resources
  
    return permissions.includes(operation)
  }
}
