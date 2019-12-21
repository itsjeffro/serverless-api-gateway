let jwt = require('jsonwebtoken');

module.exports.clientAuthorizer = async (event, context, callback) => {
  try {
    const token = getToken(event);
    const signingKey = process.env.JWT_SIGNING_KEY;
    const decodedToken = jwt.verify(token, signingKey);
    
    return callback(null, generatePolicy('Allow', event, decodedToken));
  } catch (e) {
    console.error(e);
    
    return callback("Error: Invalid token");
  }
}

/**
 * Returns token from event.
 * 
 * @param {object} event
 * @return {string}
 */
function getToken(event) {
  const tokenString = event.authorizationToken;
  const match = tokenString.match(/^Bearer (.*)$/);
  
  if (! match || match.length < 2) {
    throw new Error( "Invalid Authorization token - '" + tokenString + "' does not match 'Bearer .*'" );
  }
  
  return match[1];
}

/**
 * Returns policy.
 *
 * @param {string} effect
 * @param {object} event
 * @param {object} decodedToken
 */
function generatePolicy(effect, event, decodedToken) {
  return {
    "principalId": "user", 
    "policyDocument": {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Action": "execute-api:Invoke",
          "Effect": effect,
          "Resource": event.methodArn
        }
      ]
    },
    "context": {
      "issuer": decodedToken.iss,
      "user": decodedToken.sub,
      "company": decodedToken.company
    }
  };
}