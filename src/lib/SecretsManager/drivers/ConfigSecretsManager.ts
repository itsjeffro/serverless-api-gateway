class ConfigSecretsManager {
  config: object;

  /**
   * ConfigSecretsManager constructor.
   *
   * @param {object} config 
   */
  constructor(config: object) {
    this.config = config;
  }

  /**
   * Returns a value from a config.
   *
   * @param {string} key
   * @return {*}
   */
  getValue(key: string) {
    return '';
  }
}

module.exports = ConfigSecretsManager;
