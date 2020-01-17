# Microservice API Gateway

## Deployment

A Bitbucket pipelines YML file is included to handle the creation of the API gateway and API gateway authozier during deployment.

Lambda and API gateway resources will be created.

### Development (dev)

- Lambda - `api-gateway-dev-clientAuthorizer`
- API gateway - `ApiGateway-dev`

### Production (prod)

- Lambda - `api-gateway-prod-clientAuthorizer`
- API gateway - `ApiGateway-prod`

## Usage

Below are examples to reference the API gateway and API gateway authorizer in independent serverless setups.

### API gateway

```yml
# serverless.yml

provider:
  name: aws
  stage: ${opt:stage, 'dev'}
  apiGateway: 
    restApiId: 
      'Fn::ImportValue': ApiGateway-${self:provider.stage}-restApiId
    restApiRootResourceId: 
      'Fn::ImportValue': ApiGateway-${self:provider.stage}-rootResourceId
```

### API gateway authorizer

```yml
# serverless.yml

functions:
  hello:
    handler: handler.hello
    events:
      - http:
          path: hello
          method: get
          cors: true
          authorizer:
            type: CUSTOM
            authorizerId: ${cf:api-gateway-dev.apiGatewayRestApiAuthorizer}
```

## Testing

```
serverless invoke local --function clientAuthorizer --data '{"authorizationToken":"<jwt-token>"}' -e JWT_SIGNING_KEY=<jwt-signing-key>
```

## Additional information

- https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-importvalue.html
- https://theburningmonk.com/cloudformation-ref-and-getatt-cheatsheet/