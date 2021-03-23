const TYPES = {
  Logger: Symbol.for('Logger'),
  HTTPClient: Symbol.for('HTTPClient'),

  // use cases
  CreateValetToken: Symbol.for('CreateValetToken'),

  // env vars
  S3_BUCKET_NAME: Symbol.for('S3_BUCKET_NAME'),
  JWT_SECRET: Symbol.for('JWT_SECRET'),
  VALET_TOKEN_SECRET: Symbol.for('VALET_TOKEN_SECRET'),

  // other
  Crypter: Symbol.for('Crypter'),
  SNCrypto: Symbol.for('SNCrypto'),

  OperationValidator: Symbol.for('OperationValidator'),
  DateValidator: Symbol.for('DateValidator'),
  CreateValetTokenValidator: Symbol.for('CreateValetTokenValidator'),
  UuidValidator: Symbol.for('UuidValidator'),
  
  ValetPayloadGenerator: Symbol.for('ValetPayloadGenerator'),
  ValetTokenGenerator: Symbol.for('ValetTokenGenerator'),
}

export default TYPES
