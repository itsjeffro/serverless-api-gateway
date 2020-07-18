import TenantInterface from "./TenantInterface";
import TenantTransformer from "./TenantTransformer";

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

    return TenantTransformer.toObject(dynamo.Items[0]);
  }

  async getAll(): Promise<TenantInterface[]> {
    const params = {
      TableName: this.getTable(),
    };

    const dynamo = await this.dynamoDb.scan(params).promise();

    if (dynamo.Count === 0) {
      return [];
    }

    return dynamo.Items.map((item: TenantInterface) => {
      return TenantTransformer.toObject(item);
    });
  }
}

export default TenantRepository;
