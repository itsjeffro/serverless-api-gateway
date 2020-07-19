import AWS from "aws-sdk";
import TenantRepository from "../repository/TenantRepository";
import Tenant from "../services/Tenant";
import LambdaEvent from "../lib/LambdaEvent";

let dynamoDb = new AWS.DynamoDB({ region: "ap-southeast-2" });

module.exports.list = async (event: any) => {
  const stage = process.env.STAGE || "";
  
  const tenantRepository = new TenantRepository(dynamoDb, stage);

  let data = {
    data: await tenantRepository.getAll(),
  }

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
}

module.exports.create = async (event: any) => {
  const lambdaEvent = new LambdaEvent(event);
  const tenant = new Tenant(dynamoDb);

  let eventBody = lambdaEvent.getBody();

  let code = null;
  let body = null;

  const results = await tenant.createTenant({
    tenant_name: eventBody.tenant_name || "",
    full_name: eventBody.full_name || "",
  });

  if (null !== results) {
    code = 201;
    body = results;
  } else if (null === results) {
    code = 422;
    body = {
      message: "The following errors occurred",
      errors: {
        tenant_name: [
          `Partition key [${ eventBody.tenant_name }] already exists`
        ]
      }
    };
  }

  return {
    statusCode: code,
    body: JSON.stringify(body),
  };
}
