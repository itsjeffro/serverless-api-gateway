import LambdaEventInterface from "../LambdaEvent/LambdaEventInterface";

interface PolicyDocument {
  principalId: string;
  context?: object;
}

interface Resources {
  allowed: string[];
  denied: string[];
}

class Policy {
  lambdaEvent: any;
  resources: Resources = {
    allowed: [],
    denied: [],
  };
  context: object = {};

  constructor(lambdaEvent: any) {
    this.lambdaEvent = lambdaEvent;
  }

  setContext(context: object) {
    this.context = context;

    return this;
  }

  generate(availablePolicies: any, permissions?: string[]): PolicyDocument {
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
    
    let policy = {
      principalId: '',
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: 'Allow',
            Resource: allowed,
          }, 
          {
            Action: "execute-api:Invoke",
            Effect: 'Deny',
            Resource: denied,
          }
        ]
      }
    };

    if (this.context) {
      policy = {
        ...policy,
      };
    }

    return policy;
  }
}

export default Policy;
