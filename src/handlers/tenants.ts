import AWS from "aws-sdk";
import TenantRepository from "../repository/TenantRepository";

let dynamoDb = new AWS.DynamoDB({ region: "ap-southeast-2" });

module.exports.list = async (event: any) => {
  const stage = process.env.STAGE || "";
  
  const tenantRepository = new TenantRepository(dynamoDb, stage);

  return {
    statusCode: 200,
    body: JSON.stringify(await tenantRepository.getAll()),
  };
}
