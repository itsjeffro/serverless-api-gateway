import jwt from 'jsonwebtoken';
import LambdaEventInterface from "../lib/LambdaEvent/LambdaEventInterface";
import Auth from "../lib/Auth";
import Policy from "src/lib/Auth/Policy";
import DecodedTokenInterface from 'src/lib/Jwt/DecodedTokenInterface';

module.exports.auth = async (event: LambdaEventInterface, context: any, callback: any) => {
  try {
    // Retrieve token from lambda event.
    const auth = new Auth(event);
    const token = auth.getToken();

    // Verify token and returns decoded token.
    const signingKey = process.env.JWT_SIGNING_KEY || "";
    const verifiedToken = jwt.verify(token, signingKey);
    
    // Generate policy document.
    const policy = new Policy(event);
    const decodedToken = verifiedToken as DecodedTokenInterface;

    const policyDocument = policy.generate('Allow', {
      issuer: decodedToken.iss,
      user: decodedToken.sub,
      company: decodedToken.company
    });
    
    return callback(null, policyDocument);
  } catch (e) {
    console.error(e);
   
    if (e.name === "JsonWebTokenError") {
      return callback("Unauthoized");
    }

    return callback("Error: Invalid token");
  }
}
