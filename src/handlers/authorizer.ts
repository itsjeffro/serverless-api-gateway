import jwt from 'jsonwebtoken';
import LambdaEventInterface from "../lib/LambdaEvent/LambdaEventInterface";
import Auth from "../lib/Auth";
import PolicyDocument from "../lib/Auth/PolicyDocument";
import DecodedTokenInterface from '../lib/Jwt/DecodedTokenInterface';

module.exports.auth = async (event: LambdaEventInterface, context: any, callback: any) => {
  try {
    // Retrieve token from lambda event.
    console.log("Getting token...");

    const auth = new Auth(event);
    const token = auth.getToken();

    console.log("Retrieved token.");

    // Verify token and returns decoded token.
    console.log("Verifying token...");

    const signingKey = process.env.JWT_SIGNING_KEY || "";
    const verifiedToken = jwt.verify(token, signingKey);

    console.log("Verified token.");
    
    // Generate policy document.
    console.log("Generating policy document...");

    const decodedToken = verifiedToken as DecodedTokenInterface;
    const policy = new PolicyDocument(event);

    policy.addAllowedResource("*");

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
