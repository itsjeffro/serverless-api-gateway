import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import AWS from "aws-sdk";

import LambdaEventInterface from "../lib/LambdaEvent/LambdaEventInterface";
import LambdaEvent from "../lib/LambdaEvent";
import PolicyDocument from "../lib/PolicyDocument";
import ServicePolicyRepository from '../repository/ServicePolicyRepository';
import Logger from '../lib/Logger';
import Authorizer from '../services/Authorizer';
import TenantRepository from 'src/repository/TenantRepository';

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
    const policyDocument = new PolicyDocument(event);
    const servicePolicyRepository = new ServicePolicyRepository(dynamoDb, stage);
    const tenantRepository = new TenantRepository(dynamoDb, stage);

    const authorizer = new Authorizer(
      jwt,
      logger,
      policyDocument,
      servicePolicyRepository,
      tenantRepository
    );

    const response = await authorizer.handle(lambdaEvent);
    
    return callback(null, response);
  } catch (e) {
    logger.error({ name: e.name, message: e.message });
   
    if (e instanceof JsonWebTokenError) {
      return callback("Unauthorized");
    }

    return callback("Error: Invalid token");
  }
}
