module.exports.clientAuthorizer = async (event, context, callback) => {
  // @TODO Replaces example
  context.succeed({
    "principalId": 'userId',
    "policyDocument": {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Action": "execute-api:Invoke",
          "Effect": 'allow',
          "Resource": event.methodArn
        }
      ]
    }
  });
};
