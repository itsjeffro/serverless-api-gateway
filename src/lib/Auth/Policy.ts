import LambdaEventInterface from "../LambdaEvent/LambdaEventInterface";

interface PolicyDocument {
  context: object;
}

interface Resources {
  allowed: string[];
}

class Policy {
  event: LambdaEventInterface;
  resources: Resources = {
    allowed: []
  };

  /**
   * Policy constructor.
   *
   * @param {LambdaEventInterface} event 
   */
  constructor(event: LambdaEventInterface) {
    this.event = event;
  }

  /**
   * Add resource to allowed list.
   *
   * @param {string} resource
   * @returns {void}
   */
  addAllowedResource(resource: string): void {
    this.resources.allowed.push(resource);
  }

  /**
   * Returns all allowed resources.
   * 
   * @returns {string[]}
   */
  getAllowedResources(): string[] {
    return this.resources.allowed;
  }

  /**
   * Returns policy.
   *
   * @param {string} effect
   * @param {object} context
   * @returns {PolicyDocument}
   */
  generate(effect: string, context: object): PolicyDocument {
    let policy = {
      principalId: "user",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: effect,
            Resource: this.getAllowedResources(),
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

export default Policy;
