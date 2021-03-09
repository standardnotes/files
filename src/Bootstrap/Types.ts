const TYPES = {
  Logger: Symbol.for('Logger'),
  HTTPClient: Symbol.for('HTTPClient'),
  ValetKeyGenerator: Symbol.for('ValetKeyGenerator'),

  // env vars
  S3_BUCKET_NAME: Symbol.for('S3_BUCKET_NAME')
}

export default TYPES
