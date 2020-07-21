import LambdaEvent from "../LambdaEvent";

interface PolicyDocument {
  principalId: string;

  policyDocument: {
    Version: string;
    Statement: any[];
  }

  context?: object;
}

interface Resources {
  allowed: string[];

  denied: string[];
}

class Policy {
  /** @var LambdaEvent */
  lambdaEvent: LambdaEvent;

  /** @var Resources */
  resources: Resources = {
    allowed: [],
    denied: [],
  };

  /** @var object */
  context: object = {};

  /** @var object */
  availablePolicies: object = {};

  /** @var string[] */
  permissions: string[] = [];

  /** @var string */
  principalId: string = "";

  /**
   * PolicyDocument constructor.
   */
  constructor(lambdaEvent: LambdaEvent) {
    this.lambdaEvent = lambdaEvent;
  }

  /**
   * Setting the context will allow for passing information to the next lambda.
   */
  setContext(context: object): this {
    this.context = context;

    return this;
  }

  /**
   * Sets the policy document's principal id.
   */
  setPrincipalId(principalId: string): this {
    this.principalId = principalId;

    return this;
  }

  /**
   * Sets the available services' policies.
   */
  setAvailablePolicies(availablePolicies: any): this {
    this.availablePolicies = availablePolicies;

    return this;
  }

  /**
   * Sets the permissions that the token user can perform.
   */
  setPermissions(permissions: string[]): this {
    this.permissions = permissions;

    return this;
  }

  /**
   * Builds the policy documents statements.
   */
  buildStatement(availablePolicies: any, permissions?: string[]) {
    let allowed = [];
    let denied = [];
    let permissionList = permissions || [];

    const policies = Object.keys(availablePolicies);

    for (let i = 0; i < policies.length; i++) {
      const key = policies[i];

      let methodArn = this.lambdaEvent.getMethodArn({ 
        method: availablePolicies[key].method,
        resource: availablePolicies[key].resource,
      });

      if (permissionList.indexOf(key) !== -1) {
        allowed.push(methodArn);
      } else {
        denied.push(methodArn);
      }
    }

    let statement: any[] = [];

    if (allowed.length > 0) {
      statement.push({
        Action: "execute-api:Invoke",
        Effect: 'Allow',
        Resource: allowed,
      });
    }

    if (denied.length > 0) {
      statement.push({
        Action: "execute-api:Invoke",
        Effect: 'Deny',
        Resource: denied,
      });
    }

    return statement;
  }

  /**
   * Generates the complete policy document.
   */
  generate(): PolicyDocument {
    const statement = this.buildStatement(this.availablePolicies, this.permissions);

    let policy: PolicyDocument = {
      principalId: this.principalId,
      policyDocument: {
        Version: "2012-10-17",
        Statement: statement,
      }
    };

    if (this.context) {
      policy = {
        ...policy,
        context: this.context,
      };
    }

    return policy;
  }
}

export default Policy;
