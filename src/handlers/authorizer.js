const jwt = require('jsonwebtoken');
const Auth = require('../lib/Auth');

module.exports.auth = async (event, context, callback) => {
  try {
    const auth = new Auth;
    const token = auth.getToken(event);
    
    const signingKey = process.env.JWT_SIGNING_KEY;
    const decodedToken = jwt.verify(token, signingKey);
    
    return callback(null, auth.generatePolicy('Allow', event, decodedToken));
  } catch (e) {
    console.error(e);
    
    return callback("Error: Invalid token");
  }
}
