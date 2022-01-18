const TYPES = {
  Logger: Symbol.for('Logger'),
  HTTPClient: Symbol.for('HTTPClient'),
  S3: Symbol.for('S3'),
  SNS: Symbol.for('SNS'),

  // use cases
  CreateValetToken: Symbol.for('CreateValetToken'),
  StreamUploadFile: Symbol.for('StreamUploadFile'),

  // services
  CrossServiceTokenDecoder: Symbol.for('CrossServiceTokenDecoder'),
  ValetTokenDecoder: Symbol.for('ValetTokenDecoder'),
  ValetTokenEncoder: Symbol.for('ValetTokenEncoder'),
  Timer: Symbol.for('Timer'),
  DomainEventFactory: Symbol.for('DomainEventFactory'),
  DomainEventPublisher: Symbol.for('DomainEventPublisher'),

  // middleware
  ValetTokenAuthMiddleware: Symbol.for('ValetTokenAuthMiddleware'),
  ApiGatewayAuthMiddleware: Symbol.for('ApiGatewayAuthMiddleware'),

  // env vars
  S3_BUCKET_NAME: Symbol.for('S3_BUCKET_NAME'),
  S3_AWS_REGION: Symbol.for('S3_AWS_REGION'),
  SNS_TOPIC_ARN: Symbol.for('SNS_TOPIC_ARN'),
  SNS_AWS_REGION: Symbol.for('SNS_AWS_REGION'),
  VALET_TOKEN_SECRET: Symbol.for('VALET_TOKEN_SECRET'),
  VALET_TOKEN_TTL: Symbol.for('VALET_TOKEN_TTL'),
  AUTH_JWT_SECRET: Symbol.for('AUTH_JWT_SECRET'),
  VERSION: Symbol.for('VERSION'),
}

export default TYPES
