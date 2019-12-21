let jwt = require('jsonwebtoken');

module.exports.clientAuthorizer = async (event, context, callback) => {
  try {
    let token = event.authorizationToken;
    let decodedToken = jwt.verify(token, process.env.JWT_SIGNING_KEY);
    let effect = 'Allow';
    
    return callback(null, generatePolicy(effect, event, decodedToken));
  } catch (e) {
    return callback("Error: Invalid token");
  }
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