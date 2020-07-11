## Testing

### Jest

```bash
npm run test
```

For coverage reports, run `npm run test:coverage`. This is will be generated in the `coverage` directory.

```bash
npm run test:coverage
```

### Serverless invoke function

```bash
serverless invoke local --function clientAuthorizer --data '{"authorizationToken":"<jwt-token>", "methodArn": "arn:aws:execute-api:regionName:accountNumber:restApiId/stage/METHOD/resourcePath"}' -e JWT_SIGNING_KEY=<jwt-signing-key>
```

```bash
serverless invoke local --function versionOne
```