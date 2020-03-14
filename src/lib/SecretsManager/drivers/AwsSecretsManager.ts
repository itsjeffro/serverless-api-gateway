var AWS = require('aws-sdk');

class AwsSecretsManager {
  client: any;

  /**
   * AwsSecretsManager constructor.
   *
   * @param {object} config 
   */
  constructor(config: any) {
    this.client = new AWS.SecretsManager(config.aws);
  }

  /**
   * Returns a sercet from AWS Secrets Manager.
   *
   * @param {string} key
   * @return {*}
   */
  getValue(key: string) {
    const params = {};

    this.client.getSecretValue(params, function(err: any, data: any) {
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

export default AwsSecretsManager;
