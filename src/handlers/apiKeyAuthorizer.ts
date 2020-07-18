import AWS from "aws-sdk";
const bcrypt = require("bcryptjs");

import LambdaEventInterface from "../lib/LambdaEvent/LambdaEventInterface";
import LambdaEvent from "../lib/LambdaEvent";
import Logger from '../lib/Logger';
import ApiKeyRepository from "../repository/ApiKeyRepository";

let dynamoDb = new AWS.DynamoDB({ region: "ap-southeast-2" });

module.exports.auth = async (event: LambdaEventInterface, context: any, callback: any) => {
  const logger = new Logger(console);
  const lambdaEvent = new LambdaEvent(event);
  const stage = process.env.STAGE || "";

  const bearer = lambdaEvent.getToken();
  const apiKeySegments = bearer.split('.');

  if (apiKeySegments.length !== 2) {
    logger.log(`Segments count is [${ apiKeySegments.length }] expected 2`);
    
    return callback("Unauthorized"); 
  }

  const apiKeyRepository = new ApiKeyRepository(dynamoDb, stage);

  let key = apiKeySegments[0];
  let plainTextHash = apiKeySegments[1];

  let apiKey = await apiKeyRepository.getOneByIdentifierKey(key);
  let hash = apiKey ? apiKey.hash : "";
  let isVerified = await bcrypt.compareSync(plainTextHash, hash);

  logger.log({
    key: key,
    isRecord: apiKey !== null,
    isHashCorrect: isVerified,
  });

  if (isVerified) {
    return callback(null, {});
  }

  return callback("Unauthorized");
}
