import LoggerInterface from '../../lib/Logger/LoggerInterface';
import ServicePolicy from '../../repository/ServicePolicyRepository';
import LambdaEvent from '../../lib/LambdaEvent';
import PolicyDocument from '../../lib/PolicyDocument';
import TenantRepository from '../../repository/TenantRepository';
import HandleInterface from '../HandeInterface';

class Authorizer implements HandleInterface {
  jwt: any;
  logger: LoggerInterface;
  policyDocument: PolicyDocument;
  servicePolicyRepository: ServicePolicy;
  tenantRepository: TenantRepository;

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
   * Main handle.
   */
  async handle(lambdaEvent: LambdaEvent) {
    const verifiedToken = this.verifyToken(lambdaEvent.getToken());
    
    const tenant = await this.getTenant(verifiedToken.company);
    
    const availablePolicies = await this.getServicePolicy();
    
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

    this.logger.log("Verified token.");

    return verifiedToken;
  }

  /**
   * Returns retrieved tenant from DynamoDB.
   */
  async getTenant(tenantName: string): Promise<any> {
    this.logger.log("Retrieving tenant from DynamoDB...");
    
    const tenant = await this.tenantRepository.getOneByTenantName(tenantName);

    if (tenant === null) {
      throw new Error(`Tenant [${tenantName}] could not be found.`);
    }

    this.logger.log("Retrieved tenant.");

    return tenant;
  }

  /**
   * Returns retrieved service policy from DynamoDB.
   */
  async getServicePolicy(): Promise<any> {
    this.logger.log("Retrieving policy from DynamoDB...");

    const availablePolicies = await this.servicePolicyRepository.getPolicyByServiceNameVersion("posts-v1");

    this.logger.log("Retrieved policy.");

    return availablePolicies;
  }

  /**
   * Returns AWS policy generated based on the permissions from the token.
   */
  getPolicyDocument(availablePolicies: object, permissions: string[], tenant: any): any {
    this.logger.log("Preparing to generate document...");

    const policyDocument = this.policyDocument
      .setContext({ database: tenant.database })
      .generate(availablePolicies, permissions);

    this.logger.log(`Generated policy document: ${JSON.stringify(policyDocument)}`);

    return policyDocument;
  }
}

export default Authorizer;
