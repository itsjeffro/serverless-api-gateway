import ItemExistsException from "../../repository/ItemExistsException";

class Tenant {
  dynamoDb: any;

  constructor(dynamoDb: any) {
    this.dynamoDb = dynamoDb;
  }

  getTable(): string {
    return `internal_tenants-${process.env.STAGE || "dev"}`;
  }

  async createTenant(body: any) {
    let item = {
      ...body,
      created_at: Date.now().toString(),
      updated_at: Date.now().toString(),
    }

    const tenantName = item.tenant_name || "";

    const params = {
      Item: {
        "tenant_name": {
          S: item.tenant_name || "",
        },
        "full_name": {
          S: item.full_name || "",
        },
        "created_at": {
          N: item.created_at,
        },
        "updated_at": {
          N: item.updated_at,
        }
      },
      TableName: this.getTable(),
      ConditionExpression: "attribute_not_exists(tenant_name)",
    }

    try {
      await this.dynamoDb.putItem(params).promise();
      
      return item;
    } catch (e) {
      if (e.name === "ConditionalCheckFailedException") {
        return null
      }

      throw new e;
    }
  }
}

export default Tenant;
