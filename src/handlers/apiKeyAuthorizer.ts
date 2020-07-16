import AWS from "aws-sdk";

import LambdaEventInterface from "../lib/LambdaEvent/LambdaEventInterface";
import LambdaEvent from "../lib/LambdaEvent";
import Logger from '../lib/Logger';

let dynamoDb = new AWS.DynamoDB({ region: "ap-southeast-2" });

module.exports.auth = async (event: LambdaEventInterface, context: any, callback: any) => {
  const logger = new Logger(console);
  const lambdaEvent = new LambdaEvent(event);

  logger.log('Test');

  return callback("Unauthorized");
}
