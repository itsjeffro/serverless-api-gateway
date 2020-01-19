var AWS = require('aws-sdk');

class AwsSecretsManager {
  /**
   * AwsSecretsManager constructor.
   *
   * @param {object} config 
   */
  constructor(config) {
    this.client = new AWS.SecretsManager(config.aws);
  }

  /**
   * Returns a sercet from AWS Secrets Manager.
   *
   * @param {string} key
   * @return {*}
   */
  getValue(key) {
    this.client.getSecretValue({SecretId: secretName}, function(err, data) {
      if (err) {
        if (err.code === 'DecryptionFailureException') {
          throw err;
        }
        else if (err.code === 'InternalServiceErrorException') {
          throw err;
        }
        else if (err.code === 'InvalidParameterException') {
          throw err;
        }
        else if (err.code === 'InvalidRequestException') {
          throw err;
        }
        else if (err.code === 'ResourceNotFoundException') {
          throw err;
        }

        throw err;
      }

      if ('SecretString' in data) {
        return data.SecretString;
      } else {
        let buff = new Buffer(data.SecretBinary, 'base64');

        return buff.toString('ascii');
      }
    });
  }
}

module.exports = AwsSecretsManager;
