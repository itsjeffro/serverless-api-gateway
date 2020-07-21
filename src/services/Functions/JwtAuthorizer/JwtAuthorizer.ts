import LoggerInterface from '../../../lib/Logger/LoggerInterface';
import ServicePolicy from '../../../repository/ServicePolicyRepository';
import LambdaEvent from '../../../lib/LambdaEvent';
import PolicyDocument from '../../../lib/PolicyDocument';
import TenantRepository from '../../../repository/TenantRepository';
import HandleInterface from '../HandeInterface';

class JwtAuthorizer implements HandleInterface {
  /** @var any */
  jwt: any;

  /** @var LoggerInterface */
  logger: LoggerInterface;

  /** @var PolicyDocument */
  policyDocument: PolicyDocument;

  /** @var ServicePolicy */
  servicePolicyRepository: ServicePolicy;

  /** @var TenantRepository */
  tenantRepository: TenantRepository;

  /**
   * JwtAuthorizer constructor. 
   */
  constructor(
    jwt: any,
    logger: LoggerInterface,
    policyDocument: PolicyDocument,
    servicePolicyRepository: ServicePolicy,
    tenantRepository: TenantRepository
  ) {
    this.jwt = jwt;
    this.logger = logger;
    this.policyDocument = policyDocument;
    this.servicePolicyRepository = servicePolicyRepository;
    this.tenantRepository = tenantRepository;
  }

  /**
   * The main method for executing this class.
   */
  async handle(lambdaEvent: LambdaEvent) {
    const verifiedToken = this.verifyToken(lambdaEvent.getToken());
    
    const tenant = await this.getTenant(verifiedToken.tenant);

    const serviceName = this.getServiceName(lambdaEvent);
    
    const availablePolicies = await this.getServicePolicy(serviceName);
    
    const permissions = verifiedToken.permissions || [];

    return this.getPolicyDocument(availablePolicies, permissions, tenant);
  }

  /**
   * Returns verified token contents.
   */
  verifyToken(token: string): any {
    this.logger.log("Verifying token...");

    const signingKey = process.env.JWT_SIGNING_KEY || "";

    const verifiedToken = this.jwt.verify(token, signingKey);

    this.logger.log("Verified token");

    return verifiedToken;
  }

  /**
   * Returns retrieved tenant from DynamoDB.
   */
  async getTenant(tenantName: string): Promise<any> {
    this.logger.log(`Retrieving tenant [${tenantName}] from DynamoDB...`);
    
    const tenant = await this.tenantRepository.getOneByTenantName(tenantName);

    if (tenant === null) {
      throw new Error(`Tenant [${tenantName}] could not be found.`);
    }

    this.logger.log(`Retrieved tenant [${tenant.tenant_name}]`);

    return tenant;
  }

  /**
   * Returns service name determined by method arn resource.
   */
  getServiceName(lambdaEvent: LambdaEvent): string {
    this.logger.log(`Determining service name...`);

    const methodArn = lambdaEvent.getMethodArnSegments();

    const resource = methodArn.resource;
    const resourceSegments = resource.split('/');

    const versionCheck = /v[0-9]/g;

    let serviceName = resourceSegments[0];

    if (versionCheck.test(resourceSegments[0])) {
      const version = resourceSegments[0];
      const service = resourceSegments[1];

      serviceName = `${service}-${version}`;
    }

    this.logger.log(`Determined service name as [${ serviceName }]`);

    return serviceName;
  }

  /**
   * Returns retrieved service policy from DynamoDB.
   */
  async getServicePolicy(serviceName: string): Promise<any> {
    this.logger.log("Retrieving policy from DynamoDB...");

    const availablePolicies = await this
      .servicePolicyRepository
      .getPolicyByServiceNameVersion(serviceName);

    this.logger.log(`Retrieved policies: ${ JSON.stringify(availablePolicies) }`);

    return availablePolicies;
  }

  /**
   * Returns AWS policy generated based on the permissions from the token.
   */
  getPolicyDocument(availablePolicies: object, permissions: string[], tenant: any): any {
    this.logger.log("Preparing to generate document...");

    const policyDocument = this.policyDocument
      .setPrincipalId(tenant.tenant_name)
      .setAvailablePolicies(availablePolicies)
      .setPermissions(permissions)
      .setContext({
        tenant: tenant.tenant_name || "",
        database: tenant.database || "",
      })
      .generate();

    this.logger.log(`Generated policy document: ${JSON.stringify(policyDocument)}`);

    return policyDocument;
  }
}

export default JwtAuthorizer;
