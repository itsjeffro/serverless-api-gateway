class ServicePolicyRepository {
  dynamoDb: any;
  stage: string;

  constructor(dynamoDb: any, stage: string) {
    this.dynamoDb = dynamoDb;
    this.stage = stage;
  }

  getTable(): string {
    return `internal_service_policies-${this.stage}`;
  }

  async getPolicyByServiceNameVersion(serviceNameVersion: string): Promise<object> {
    const params = {
      TableName: this.getTable(),
      ExpressionAttributeValues: {
        ':service_name_version': {
          S: serviceNameVersion
        }
      },
      KeyConditionExpression: 'service_name_version = :service_name_version',
      Limit: 1
    };

    const dynamo = await this.dynamoDb.query(params).promise();

    if (dynamo.Count !== 1) {
      throw new Error(`service_name_version [${serviceNameVersion}] not found`);
    }

    const item = dynamo.Items[0];

    let policy = item.policy.S;

    if (policy === "") {
      return [];
    }

    return JSON.parse(policy);
  }
}

export default ServicePolicyRepository;
