import ApiKeyInterface from "./ApiKeyInterface";

class ApiKeyRepository {
  dynamoDb: any;
  stage: string;

  constructor(dynamoDb: any, stage: string) {
    this.dynamoDb = dynamoDb;
    this.stage = stage;
  }

  getTable(): string {
    return `internal_api_keys-${this.stage}`;
  }

  async getOneByIdentifierKey(identifierKey: string): Promise<ApiKeyInterface|null> {
    const params = {
      TableName: this.getTable(),
      ExpressionAttributeValues: {
        ':identifierKey': {
          S: identifierKey
        }
      },
      KeyConditionExpression: 'identifier_key = :identifierKey',
      Limit: 1
    };

    const dynamo = await this.dynamoDb.query(params).promise();

    if (dynamo.Count !== 1) {
      return null;
    }

    const item = dynamo.Items[0];

    return {
      project_name: item.project_name ? item.project_name.S : "",
      identifier_key: item.identifier_key ? item.identifier_key.S : "",
      hash: item.hash ? item.hash.S : "",
      permissions: item.permissions ? item.permissions.S : "",
    };
  }
}

export default ApiKeyRepository;
