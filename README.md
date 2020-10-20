# Serverless API Gateway

A reusable AWS Api Gateway using the Serverless framework.

The following AWS services are used:

- API Gateway
- API Gateway custom domain names
- Route53
- Lambda
- DynamoDB

## Getting started

See [Getting started](docs/getting-started.md) for more information.

## Resources

### API Gateway

- `<stage>-api-gateway`

### API Gateway custom domain names

- `api.itsjeffro.com`
- `api-dev.itsjeffro.com`

### DynamoDB

- `internal_service_docs-<stage>`
- `internal_service_policies-<stage>`
- `internal_tenants-<stage>`

### Lambda

- `api-gateway-<stage>-clientAuthorizer`
- `api-gateway-<stage>-versionOne`
