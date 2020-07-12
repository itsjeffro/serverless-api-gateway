import LambdaEvent from "../index";

test('Throw Error if there is no Bearer match', () => {
  const event = {
    authorizationToken: "token"
  };
  
  const lambdaEvent = new LambdaEvent(event);

  expect(() => {
    lambdaEvent.getToken();
  }).toThrowError();
});

test('Prepare methodArn segments', () => {
  const event = {
    type: 'TOKEN',
    methodArn: 'arn:aws:execute-api:regionName:accountNumber:restApiId/stage/METHOD/resource/path',
    authorizationToken: "token"
  };

  const lambdaEvent = new LambdaEvent(event);

  expect(lambdaEvent.getMethodArnSegments()).toMatchObject({
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

  const lambdaEvent = new LambdaEvent(event);

  const options = {
    method: '*',
    resource: '*',
  }

  expect(lambdaEvent.getMethodArn(options)).toBe('arn:aws:execute-api:regionName:accountNumber:restApiId/stage/*/*');
});
