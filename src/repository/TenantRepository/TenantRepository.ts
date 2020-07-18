interface TenantInterface {
  tenant_name: string
  database: string
}

class TenantRepository {
  dynamoDb: any;
  stage: string;

  constructor(dynamoDb: any, stage: string) {
    this.dynamoDb = dynamoDb;
    this.stage = stage;
  }

  getTable(): string {
    return `internal_tenants-${this.stage}`;
  }

  async getOneByTenantName(tenantName: string): Promise<TenantInterface|null> {
    const params = {
      TableName: this.getTable(),
      ExpressionAttributeValues: {
        ':tenantName': {
          S: tenantName
        }
      },
      KeyConditionExpression: 'tenant_name = :tenantName',
      Limit: 1
    };

    const dynamo = await this.dynamoDb.query(params).promise();

    if (dynamo.Count !== 1) {
      return null;
    }

    const item = dynamo.Items[0];

    return {
      tenant_name: item.tenant_name ? item.tenant_name.S : null,
      database: item.database ? item.database.S : null,
    };
  }

  async getAll(): Promise<TenantInterface[]> {
    const params = {
      TableName: this.getTable(),
    };

    const dynamo = await this.dynamoDb.scan(params).promise();

    if (dynamo.Count === 0) {
      return [];
    }

    return dynamo.Items;
  }
}

export default TenantRepository;
