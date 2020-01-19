class ConfigSecretsManager {
  /**
   * ConfigSecretsManager constructor.
   *
   * @param {object} config 
   */
  constructor(config) {
    this.config = config;
  }

  /**
   * Returns a value from a config.
   *
   * @param {string} key
   * @return {*}
   */
  getValue(key) {
    return '';
  }
}

module.exports = ConfigSecretsManager;
