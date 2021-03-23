import 'reflect-metadata'
import { injectable } from 'inversify'
import { Resource } from '../Resource/Resource'
import { UserPermission } from '../User/UserPermission'
import { Operation } from './Operation'

// todo: https://app.asana.com/0/1199914526147392/1200093443903077/f
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
