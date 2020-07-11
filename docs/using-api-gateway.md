# Using the API Gateway

Below are examples to reference the API gateway and API gateway authorizer in independent serverless setups.

## API gateway

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

## API gateway authorizer

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

## Additional information

- https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-importvalue.html
- https://theburningmonk.com/cloudformation-ref-and-getatt-cheatsheet/
