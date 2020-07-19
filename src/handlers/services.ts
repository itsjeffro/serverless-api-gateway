import AWS from "aws-sdk";
import ServicePolicyRepository from "../repository/ServicePolicyRepository";

let dynamoDb = new AWS.DynamoDB({ region: "ap-southeast-2" });

module.exports.list = async (event: any) => {
  const stage = process.env.STAGE || "";
  
  const serviceRepository = new ServicePolicyRepository(dynamoDb, stage);

  let data = {
    data: await serviceRepository.getAll(),
  };

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
}
