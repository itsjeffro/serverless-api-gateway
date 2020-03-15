class ServicePolicy {
  dynamoDb: any;
  tableName: string;

  /**
   * ServicePolicy constructor.
   *
   * @param {any} dynamoDb
   * @param {string} tableName
   */
  constructor(dynamoDb: any, tableName: string) {
    this.dynamoDb = dynamoDb;
    this.tableName = tableName;
  }

  /**
   * Retrieve available policies for the requested resource. We will then check if the
   * scopes provided in the JWT will determine if the user is authorized to continue.
   *
   * @param {string} serviceNameVersion
   * @returns {Promise<string>}
   */
  async getPolicyByServiceNameVersion(serviceNameVersion: string): Promise<[]> {
    const params = {
      TableName: this.tableName,
      ExpressionAttributeValues: {
        ':service_name_version': { S: serviceNameVersion },
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

    policy = JSON.parse(policy);

    policy = Object.keys(policy).map((key) => {
      return policy[key];
    });

    return policy;
  }
}

export default ServicePolicy;
