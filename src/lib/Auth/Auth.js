class Auth {
  constructor(event) {
    this.event = event;
  }

  /**
   * Returns methodArn segments.
   *
   * @return {object}
   */
  getMethodArnSegments() {
    let tmp = this.event.methodArn.split(':');
    let apiTmp = tmp[5].split('/');
    let resource = '';

    if (apiTmp[3]) {
      resource += apiTmp.slice(3, apiTmp.length).join('/');
    }

    return {
      service: tmp[0] + ':' + tmp[1] + ':' + tmp[2],
      regionName: tmp[3],
      accountNumber: tmp[4],
      restApiId: apiTmp[0],
      stage: apiTmp[1],
      method: apiTmp[2],
      resource: resource,
    };
  }

  /**
   * Return built method.
   *
   * @param {object} options
   * @return {string}
   */
  getMethodArn(options) {
    let arn = {
      ...this.getMethodArnSegments(),
      ...options,
    };
  
    return `${arn.service}:${arn.regionName}:${arn.accountNumber}:${arn.restApiId}/${arn.stage}/*/${arn.resource}`;
  }

  /**
   * Returns token from event.
   * 
   * @return {string}
   */
  getToken() {
    const tokenString = this.event.authorizationToken;
    const match = tokenString.match(/^Bearer (.*)$/);
    
    if (! match || match.length < 2) {
      throw new Error( "Invalid Authorization token - '" + tokenString + "' does not match 'Bearer .*'" );
    }
    
    return match[1];
  }

  /**
   * Returns policy.
   *
   * @param {string} effect
   * @param {object} context
   */
  generatePolicy(effect, context) {
    let policy = {
      principalId: "user", 
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: effect,
            Resource: this.getMethodArn({method: '*'}),
          }
        ]
      },
      context: {},
    };

    if (context) {
      policy.context = context;
    }

    return policy;
  }
}

module.exports = Auth;