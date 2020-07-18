import LambdaEventInteface from "./LambdaEventInterface";

class LambdaEvent {
  event: LambdaEventInteface;

  /**
   * @param {LambdaEventInteface} event
   */
  constructor(event: LambdaEventInteface) {
    this.event = event;
  }

  /**
   * Returns methodArn segments.
   *
   * @return {object}
   */
  getMethodArnSegments() {
    const methodArn = this.event.methodArn || "";

    let tmp = methodArn.split(':');
    let apiTmp = tmp[5].split('/');
    let resource = "";

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
  getMethodArn(options: object) {
    let arn = {
      ...this.getMethodArnSegments(),
      ...options,
    };

    let method = (arn.method || "").toUpperCase();
  
    return `${arn.service}:${arn.regionName}:${arn.accountNumber}:${arn.restApiId}/${arn.stage}/${method}/${arn.resource}`;
  }

  /**
   * Returns token from event.
   * 
   * @return {string}
   */
  getToken() {
    const tokenString = this.event.authorizationToken || "";
    const match = tokenString.match(/^Bearer (.*)$/);
    
    if (! match || match.length < 2) {
      throw new Error( "Invalid Authorization token - '" + tokenString + "' does not match 'Bearer .*'" );
    }
    
    return match[1];
  }

  getBody(): any {
    try {
      let body = JSON.parse(this.event.body || "");
      
      return body;
    } catch (e) {
      throw new Error("Problems parsing JSON");
    }
  }
}

export default LambdaEvent;
