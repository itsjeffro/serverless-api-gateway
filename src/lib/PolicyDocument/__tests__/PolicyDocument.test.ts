import PolicyDocument from "../index";
import LambdaEventInterface from "../../LambdaEvent/LambdaEventInterface";
import LambdaEvent from '../../LambdaEvent';
import ServicePolicyRepository from '../../../repository/ServicePolicyRepository';
import { resolve } from "path";

describe("Tests PolicyDocument", () => {

  describe("Tests generated policy document", () => {

    beforeAll(() => {
      const results = {
        "posts.list": {
          "method": "get",
          "resource": "v1/posts"
        },
        "posts.get": {
          "method": "get",
          "resource": "v1/posts/*"
        },
        "posts.create": {
          "method": "post",
          "resource": "v1/posts"
        },
        "posts.update": {
          "method": "put",
          "resource": "v1/posts/*"
        },
        "posts.delete": {
          "method": "delete",
          "resource": "v1/posts/*"
        },
      };

      jest
        .spyOn(ServicePolicyRepository.prototype, 'getPolicyByServiceNameVersion')
        .mockImplementation(() => 
          Promise.resolve(results)
        );
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('returns expected denied and allowed statements', async () => {
      const event: LambdaEventInterface = {
        methodArn: 'arn:aws:execute-api:regionName:accountNumber:restApiId/stage/METHOD/resourcePath',
      };
      
      const servicePolicy = new ServicePolicyRepository(null, '');
      const availablePolicies = await servicePolicy.getPolicyByServiceNameVersion('');

      const permissions = [
        "posts.list",
        "posts.get",
        "posts.create",
      ];
      
      const policyDocument = new PolicyDocument(new LambdaEvent(event));
      const document = policyDocument
        .setAvailablePolicies(availablePolicies)
        .setPermissions(permissions)
        .generate();

      const expected = {
        principalId: '',
        policyDocument: {
          Version: "2012-10-17",
          Statement: [
            {
              Action: "execute-api:Invoke",
              Effect: 'Allow',
              Resource: [
                'arn:aws:execute-api:regionName:accountNumber:restApiId/stage/GET/v1/posts',
                'arn:aws:execute-api:regionName:accountNumber:restApiId/stage/GET/v1/posts/*',
                'arn:aws:execute-api:regionName:accountNumber:restApiId/stage/POST/v1/posts',
              ],
            },
            {
              Action: "execute-api:Invoke",
              Effect: 'Deny',
              Resource: [
                'arn:aws:execute-api:regionName:accountNumber:restApiId/stage/PUT/v1/posts/*',
                'arn:aws:execute-api:regionName:accountNumber:restApiId/stage/DELETE/v1/posts/*',
              ],
            }
          ]
        }
      };
    
      expect(document).toMatchObject(expected);
    });

    it("returns context when provided", async () => {
      const event: LambdaEventInterface = {
        methodArn: 'arn:aws:execute-api:regionName:accountNumber:restApiId/stage/METHOD/resourcePath',
      };
      
      const policyDocument = new PolicyDocument(new LambdaEvent(event));

      const document = policyDocument
        .setAvailablePolicies({})
        .setContext({
          tenant: "name",
          database: "tenant",
        })
        .generate();

      const expected = {
        principalId: '',
        policyDocument: {
          Version: "2012-10-17",
          Statement: []
        },
        context: {
          tenant: "name",
          database: "tenant",
        }
      };

      expect(document).toMatchObject(expected);
    })

  });

});
