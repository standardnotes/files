const TYPES = {
  Logger: Symbol.for('Logger'),
  HTTPClient: Symbol.for('HTTPClient'),
  S3: Symbol.for('S3'),

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
  S3_AWS_REGION: Symbol.for('S3_AWS_REGION'),
  JWT_SECRET: Symbol.for('JWT_SECRET'),
  VALET_TOKEN_SECRET: Symbol.for('VALET_TOKEN_SECRET'),
  VERSION: Symbol.for('VERSION'),
}

export default TYPES
