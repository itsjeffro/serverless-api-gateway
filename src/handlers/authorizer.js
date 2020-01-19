const jwt = require('jsonwebtoken');
const Auth = require('../lib/Auth');

module.exports.auth = async (event, context, callback) => {
  try {
    const auth = new Auth(event);
    const token = auth.getToken(event);
    
    const signingKey = process.env.JWT_SIGNING_KEY;
    const decodedToken = jwt.verify(token, signingKey);

    const context = {
      issuer: decodedToken.iss,
      user: decodedToken.sub,
      company: decodedToken.company
    };
    
    return callback(null, auth.generatePolicy('Allow', context));
  } catch (e) {
    console.error(e);
    
    return callback("Error: Invalid token");
  }
}
