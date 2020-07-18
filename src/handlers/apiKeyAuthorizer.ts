import AWS from "aws-sdk";
const bcrypt = require("bcryptjs");

import LambdaEventInterface from "../lib/LambdaEvent/LambdaEventInterface";
import LambdaEvent from "../lib/LambdaEvent";
import Logger from '../lib/Logger';
import ApiKeyRepository from "../repository/ApiKeyRepository";
import PolicyDocument from "../lib/PolicyDocument";
import ServicePolicyRepository from "../repository/ServicePolicyRepository";

let dynamoDb = new AWS.DynamoDB({ region: "ap-southeast-2" });

module.exports.auth = async (event: LambdaEventInterface, context: any, callback: any) => {
  const logger = new Logger(console);
  const lambdaEvent = new LambdaEvent(event);
  const policyDocument = new PolicyDocument(lambdaEvent);

  const stage = process.env.STAGE || "";

  const bearer = lambdaEvent.getToken();
  const apiKeySegments = bearer.split('.');

  if (apiKeySegments.length !== 2) {
    logger.log(`Segments count is [${ apiKeySegments.length }] expected 2`);
    
    return callback("Unauthorized"); 
  }

  // Api key
  const apiKeyRepository = new ApiKeyRepository(dynamoDb, stage);
  
  let key = apiKeySegments[0];
  let plainTextHash = apiKeySegments[1];
  
  let apiKey = await apiKeyRepository.getOneByIdentifierKey(key);
  let hash = apiKey ? apiKey.hash : "";
  let permissions = apiKey ? apiKey.permissions.split(",") : [];
  let isVerified = await bcrypt.compareSync(plainTextHash, hash);
  
  // Service
  const serviceRepository = new ServicePolicyRepository(dynamoDb, stage);

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
  
  let servicePolicy = await serviceRepository.getPolicyByServiceNameVersion(serviceName);

  logger.log({
    key: key,
    isRecord: apiKey !== null,
    isHashCorrect: isVerified,
    permissions: permissions,
  });

  logger.log(servicePolicy);

  if (isVerified) {
    const document = policyDocument
      .setPrincipalId(key)
      .setAvailablePolicies(servicePolicy)
      .setPermissions(permissions)
      .generate();

    return callback(null, document);
  }

  return callback("Unauthorized");
}
