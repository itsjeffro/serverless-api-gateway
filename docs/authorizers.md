# Auhtorizers

## JWT authorizer

Below is an example JWT payload. Currently, only the HMACS (HS256) algorithm is supported.

```json
{
  "sub": "1234567890",
  "iat": 1516239022,
  "tenant": "demo",
  "permissions": [
      // Depending on the permissions for the microservice's endpoints.
  ]
}
```
