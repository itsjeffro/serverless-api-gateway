const config = require('../../../config/secrets');

class SecretsManager {
  /**
   * Retrieve a driver.
   *
   * @param {string} name 
   */
  driver(name) {
    return this;
  }

  /**
   * Returns instance of the AWS Secrets Manager.
   * 
   * @returns {AwsSecretsManager}
   */
  getAwsSercetsManagerDriver() {
    const AwsSecretsManager = require('./drivers/AwsSecretsManager');
    
    return new AwsSecretsManager(config.drivers.aws);
  }

  /**
   * Returns instance of the Configuration Manager.
   * 
   * @returns {ConfigSecretsManager}
   */
  getConfigSecretsManager() {
    const ConfigSecretsManager = require('./drivers/ConfigSecretsManager');
    
    return new ConfigSecretsManager(config.drivers.config);
  }

  /**
   * Returns a mixed value/secret from the driver.
   *
   * @param {string} key 
   * @returns {*}
   */
  getValue(key) {
    return this.driver;
  }
}

module.exports = SecretsManager;
