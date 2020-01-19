const Auth = require('./Auth');

test('Throw Error if there is no Bearer match', () => {
  const event = {
    authorizationToken: "token"
  };
  
  const auth = new Auth(event);

  expect(() => {
    auth.getToken();
  }).toThrowError();
});

test('Prepare methodArn segments', () => {
  const event = {
    type: 'TOKEN',
    methodArn: 'arn:aws:execute-api:regionName:accountNumber:restApiId/stage/METHOD/resource/path',
    authorizationToken: "token"
  };

  const auth = new Auth(event);

  expect(auth.getMethodArnSegments()).toMatchObject({
    service: "arn:aws:execute-api",
    regionName: "regionName",
    accountNumber: "accountNumber",
    restApiId: "restApiId",
    stage: "stage",
    method: "METHOD",
    resource: "resource/path",
  });
});

test('Get methodArn with options', () => {
  const event = {
    methodArn: 'arn:aws:execute-api:regionName:accountNumber:restApiId/stage/METHOD/resourcePath',
  };

  const auth = new Auth(event);
  const options = {
    method: '*',
    resource: '*',
  }

  expect(auth.getMethodArn(options)).toBe('arn:aws:execute-api:regionName:accountNumber:restApiId/stage/*/*');
});

test.each([
  [null, {}],
  [{user: 'username'}, {user: 'username'}]
])('Policy to return %o from %o that was initally passed', (actual, expected) => {
  const event = {
    methodArn: 'arn:aws:execute-api:regionName:accountNumber:restApiId/stage/METHOD/resourcePath',
  };

  const auth = new Auth(event);
  const policy = auth.generatePolicy('allow', actual);

  expect(policy.context).toMatchObject(expected);
});
