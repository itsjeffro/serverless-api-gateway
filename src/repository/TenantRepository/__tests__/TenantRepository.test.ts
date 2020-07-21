import TenantRepository from '../index';

describe("Tests TenantRepository", () => {

  describe("Tests queries", () => {
    
    const dynamoDb = {
      query: jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue({
          Count: 1,
          Items: [
            {
              tenant_name: {
                S: "tenant"
              },
              database: {
                S: "database"
              }
            }
          ]
        })
      })
    };

    it("returns 1 tenant record by tenant_name", async () => {
      const tenantRepository = new TenantRepository(dynamoDb, 'dev');

      const response = await tenantRepository.getOneByTenantName('tenant');

      const expected = {
        tenant_name: "tenant",
      };

      expect(response).toMatchObject(expected);
    });

    it("returns correct table name", async () => {
      const tenantRepository = new TenantRepository(dynamoDb, 'dev');

      const table = tenantRepository.getTable();

      expect(table).toBe("internal_tenants-dev");
    })

  });

});
