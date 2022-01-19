const TYPES = {
  Logger: Symbol.for('Logger'),
  HTTPClient: Symbol.for('HTTPClient'),
  S3: Symbol.for('S3'),
  SNS: Symbol.for('SNS'),

  // use cases
  StreamUploadFile: Symbol.for('StreamUploadFile'),

  // services
  ValetTokenDecoder: Symbol.for('ValetTokenDecoder'),
  Timer: Symbol.for('Timer'),
  DomainEventFactory: Symbol.for('DomainEventFactory'),
  DomainEventPublisher: Symbol.for('DomainEventPublisher'),

  // middleware
  ValetTokenAuthMiddleware: Symbol.for('ValetTokenAuthMiddleware'),

  // env vars
  S3_BUCKET_NAME: Symbol.for('S3_BUCKET_NAME'),
  S3_AWS_REGION: Symbol.for('S3_AWS_REGION'),
  SNS_TOPIC_ARN: Symbol.for('SNS_TOPIC_ARN'),
  SNS_AWS_REGION: Symbol.for('SNS_AWS_REGION'),
  VALET_TOKEN_SECRET: Symbol.for('VALET_TOKEN_SECRET'),
  VERSION: Symbol.for('VERSION'),
}

export default TYPES
