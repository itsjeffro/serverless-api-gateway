# Getting started

### Important notes

If you would like to you custom domains, you must first create a certificate in AWS Certificate Manager. Once you have created the certificate, update the `serverless.yml` file with the appropriate values under `custom.domain`.

## Project setup

Clone the project to your local.

```bash
git clone https://itsjeffro@bitbucket.org/itsjeffro/microservice-api-gateway.git
```

Create an `.env` using the example provided. Ensure you update the variables.

```bash
cp .env.example .env
```

Next, install the dependencies and then run `npm run build`.

```bash
npm i

npm run build

rm -rf node_modules

npm i --production
```

You may then run the follow commands below.

```bash
serverless create_domain --stage <dev|prod>

serverless deploy --stage <dev|prod>
```
