const TYPES = {
  Logger: Symbol.for('Logger'),
  HTTPClient: Symbol.for('HTTPClient'),

  // use cases
  CreateValetToken: Symbol.for('CreateValetToken'),
  
  // services
  Crypter: Symbol.for('Crypter'),
  
  ValetPayloadGenerator: Symbol.for('ValetPayloadGenerator'),
  ValetTokenGenerator: Symbol.for('ValetTokenGenerator'),

  // validators
  OperationValidator: Symbol.for('OperationValidator'),
  DateValidator: Symbol.for('DateValidator'),
  CreateValetTokenValidator: Symbol.for('CreateValetTokenValidator'),
  UuidValidator: Symbol.for('UuidValidator'),

  // env vars
  S3_BUCKET_NAME: Symbol.for('S3_BUCKET_NAME'),
  JWT_SECRET: Symbol.for('JWT_SECRET'),
  VALET_TOKEN_SECRET: Symbol.for('VALET_TOKEN_SECRET'),
}

export default TYPES
