const bcrypt = require("bcryptjs");

import HandleInterface from "../HandeInterface";
import LambdaEvent from "../../../lib/LambdaEvent";
import LoggerInterface from "../../../lib/Logger/LoggerInterface";
import ServicePolicyRepository from "../../../repository/ServicePolicyRepository";
import ApiKeyRepository from "../../../repository/ApiKeyRepository";
import PolicyDocument from "../../../lib/PolicyDocument";

class ApiKeyAuthorizer implements HandleInterface {
  logger: LoggerInterface;
  apiKeyRepository: ApiKeyRepository;
  servicePolicyRepository: ServicePolicyRepository;
  policyDocument: PolicyDocument;

  constructor(
    logger: LoggerInterface,
    apiKeyRepository: ApiKeyRepository,
    servicePolicyRepository: ServicePolicyRepository,
    policyDocument: PolicyDocument
  ) {
    this.logger = logger;
    this.apiKeyRepository = apiKeyRepository;
    this.servicePolicyRepository = servicePolicyRepository;
    this.policyDocument = policyDocument;
  }

  async handle(lambdaEvent: LambdaEvent): Promise<any> {
    const bearer = lambdaEvent.getToken();
    const apiKeySegments = bearer.split('.');
  
    if (apiKeySegments.length !== 2) {
      this.logger.log(`Segments count is [${ apiKeySegments.length }] expected 2`);
      
      throw new Error("Unauthorized");
    }
  
    // Api key
    let key = apiKeySegments[0];
    let plainTextHash = apiKeySegments[1];
    
    let apiKey = await this.apiKeyRepository.getOneByIdentifierKey(key);
    let hash = apiKey ? apiKey.hash : "";
    let permissions = apiKey ? apiKey.permissions.split(",") : [];
    let isVerified = await bcrypt.compareSync(plainTextHash, hash);

    this.logger.log(permissions);

    // Get services
    let services = this.getServicesFromPermissions(permissions);

    permissions = this.getPermissions(permissions);

    this.logger.log(services);
    
    // Service
    let policies = {};

    for (let i = 0; i < services.length; i++) {
      let serviceName = this.getServiceName(services[i]);

      let servicePolicy = await this.servicePolicyRepository.getPolicyByServiceNameVersion(serviceName);

      policies = {
        ...policies,
        ...servicePolicy
      };
    }

    this.logger.log(policies);
  
    this.logger.log({
      key: key,
      isRecord: apiKey !== null,
      isHashCorrect: isVerified,
      permissions: permissions,
    });
  
    if (isVerified) {
      const document = this.policyDocument
        .setPrincipalId(key)
        .setAvailablePolicies(policies)
        .setPermissions(permissions)
        .generate();
  
      return document;
    }
  
    throw new Error("Unauthorized");
  }

  getServicesFromPermissions(permissions: string[]): string[] {
    let services = [];

    for (let i = 0; i < permissions.length; i++) {
      let permissionSegements = permissions[i].split(".");
      let permission = permissionSegements[0];

      if (services.indexOf(permission) === -1) {
        services.push(permission);
      }
    }

    return services;
  }

  getServiceName(resource: string): string {
    const resourceSegments = resource.split('/');
    const versionCheck = /v[0-9]/g;
  
    let serviceName = resourceSegments[0];
  
    if (versionCheck.test(resourceSegments[0])) {
      const version = resourceSegments[0];
      const service = resourceSegments[1];
  
      serviceName = `${service}-${version}`;
    }

    return serviceName;
  }

  getPermissions(permissions: string[]): string[] {
    return permissions.map((permission: string) => {
      let permissionSegments = permission.split("/");

      if (permissionSegments.length === 2) {
        return permissionSegments[1];
      }

      return permissionSegments[0];
    });
  }
}

export default ApiKeyAuthorizer;
