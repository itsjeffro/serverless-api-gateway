import ServicePolicyRepository from '../index';

describe("Tests ServicePolicyRepository", () => {

  describe("Tests returns policy list", () => {

    const item = JSON.stringify({
      "posts.list": {
        "method": "get",
        "resource": "v1/posts"
      },
    });
    
    const dynamoDb = {
      query: jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue({
          Count: 1,
          Items: [
            {
              policy: {
                S: item
              }
            }
          ]
        })
      })
    };

    it("returns list of available permissions for service", async () => {
      const servicePolicyRepository = new ServicePolicyRepository(dynamoDb, 'dev');

      const response = await servicePolicyRepository.getPolicyByServiceNameVersion('posts-v1');

      const expected = {
        "posts.list": {
          "method": "get",
          "resource": "v1/posts"
        },
      };

      expect(response).toMatchObject(expected);
    });

    it("returns correct table name", async () => {
      const servicePolicyRepository = new ServicePolicyRepository(dynamoDb, 'dev');

      const table = servicePolicyRepository.getTable();

      expect(table).toBe("internal_service_policies-dev");
    })

  });

});
