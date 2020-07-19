import AWS from "aws-sdk";

import LambdaEventInterface from "../lib/LambdaEvent/LambdaEventInterface";
import LambdaEvent from "../lib/LambdaEvent";
import Logger from '../lib/Logger';
import ApiKeyRepository from "../repository/ApiKeyRepository";
import PolicyDocument from "../lib/PolicyDocument";
import ServicePolicyRepository from "../repository/ServicePolicyRepository";
import ApiKeyAuthorizer from "../services/Functions/ApiKeyAuthorizer";

let dynamoDb = new AWS.DynamoDB({ region: "ap-southeast-2" });

module.exports.auth = async (event: LambdaEventInterface, context: any, callback: any) => {
  const stage = process.env.STAGE || "";

  const logger = new Logger(console);
  const lambdaEvent = new LambdaEvent(event);
  const policyDocument = new PolicyDocument(lambdaEvent);
  const apiKeyRepository = new ApiKeyRepository(dynamoDb, stage);
  const servicePolicyRepository = new ServicePolicyRepository(dynamoDb, stage);

  try {
    const apiKeyAuthorizer = new ApiKeyAuthorizer(
      logger,
      apiKeyRepository,
      servicePolicyRepository,
      policyDocument
    );

    let document = await apiKeyAuthorizer.handle(lambdaEvent);

    return callback(null, document);
  } catch (e) {
    return callback("Unauthorized");
  }
}
