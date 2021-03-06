import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import AWS from "aws-sdk";

import LambdaEventInterface from "../lib/LambdaEvent/LambdaEventInterface";
import LambdaEvent from "../lib/LambdaEvent";
import PolicyDocument from "../lib/PolicyDocument";
import ServicePolicyRepository from '../repository/ServicePolicyRepository';
import Logger from '../lib/Logger';
import JwtAuthorizer from '../services/Functions/JwtAuthorizer';
import TenantRepository from '../repository/TenantRepository';

let dynamoDb = new AWS.DynamoDB({ region: "ap-southeast-2" });

module.exports.auth = async (event: LambdaEventInterface, context: any, callback: any) => {
  const logger = new Logger(console);
  const lambdaEvent = new LambdaEvent(event);
  const arnSegments = lambdaEvent.getMethodArnSegments();
  const stage = process.env.STAGE || "";

  logger
    .setHeader('stage', stage)
    .setHeader('resource', arnSegments.resource);
  
  try {
    const policyDocument = new PolicyDocument(lambdaEvent);
    const servicePolicyRepository = new ServicePolicyRepository(dynamoDb, stage);
    const tenantRepository = new TenantRepository(dynamoDb, stage);

    const jwtAuthorizer = new JwtAuthorizer(
      jwt,
      logger,
      policyDocument,
      servicePolicyRepository,
      tenantRepository
    );

    const response = await jwtAuthorizer.handle(lambdaEvent);
    
    return callback(null, response);
  } catch (e) {
    logger.error({ name: e.name, message: e.message });
   
    if (e instanceof JsonWebTokenError) {
      return callback("Unauthorized");
    }

    return callback(`Error: ${ e.message }`);
  }
}
