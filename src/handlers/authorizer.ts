import jwt from 'jsonwebtoken';
import AWS from "aws-sdk";

import LambdaEventInterface from "../lib/LambdaEvent/LambdaEventInterface";
import LambdaEvent from "../lib/LambdaEvent";
import PolicyDocument from "../lib/PolicyDocument";
import DecodedTokenInterface from '../lib/Jwt/DecodedTokenInterface';
import ServicePolicy from '../lib/ServicePolicy/ServicePolicy';

let dynamoDb = new AWS.DynamoDB({ region: "ap-southeast-2" });

module.exports.auth = async (event: LambdaEventInterface, context: any, callback: any) => {
  try {
    // Retrieve token from lambda event.
    console.log("Getting token...");

    const lambdaEvent = new LambdaEvent(event);
    const token = lambdaEvent.getToken();

    console.log("Retrieved token.");

    // Verify token and returns decoded token.
    console.log("Verifying token...");

    const signingKey = process.env.JWT_SIGNING_KEY || "";
    const verifiedToken = jwt.verify(token, signingKey);

    console.log("Verified token.");

    // Retrieving service policy from dynamoDB.
    console.log("Retrieving policy...");

    const servicePolicy = new ServicePolicy(dynamoDb, "internal_service_policies");
    const servicePolicyMethods: any = await servicePolicy.getPolicyByServiceNameVersion("posts-v1");
    
    // Generate policy document.
    console.log("Generating policy document...");

    const decodedToken = verifiedToken as DecodedTokenInterface;
    const policy = new PolicyDocument(event, decodedToken.sub);

    for (let i = 0; i < servicePolicyMethods.length; i++) {
      let methodArn = lambdaEvent.getMethodArn({ 
        method: servicePolicyMethods[i].method,
        resource: servicePolicyMethods[i].resource
      });

      policy.addAllowedResource(methodArn);
    }

    const policyDocument = policy.generate('Allow', {
      issuer: decodedToken.iss,
      user: decodedToken.sub,
      company: decodedToken.company
    });

    console.log(`Generated policy document: ${JSON.stringify(policyDocument)}`);
    
    return callback(null, policyDocument);
  } catch (e) {
    console.error(e);
   
    if (e.name === "JsonWebTokenError") {
      return callback("Unauthorized");
    }

    return callback("Error: Invalid token");
  }
}
