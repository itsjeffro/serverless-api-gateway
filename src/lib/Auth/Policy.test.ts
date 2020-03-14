import Policy from "./Policy";
import LambdaEventInterface from "../LambdaEvent/LambdaEventInterface";

describe("Tests Policy", () => {

  describe("Tests generated policy document", () => {

    test.each([
      [{}, {}],
      [{user: 'username'}, {user: 'username'}]
    ])('returns %o from %o that was initally passed', (actual, expected) => {
      const event: LambdaEventInterface = {
        methodArn: 'arn:aws:execute-api:regionName:accountNumber:restApiId/stage/METHOD/resourcePath',
      };
    
      const policy = new Policy(event);
      const policyDocument = policy.generate('allow', actual);
    
      expect(policyDocument.context).toMatchObject(expected);
    });

  });

  describe("Tests resources", () => {

    it('returns expected statement resources', () => {
      const event: LambdaEventInterface = {
        methodArn: 'arn:aws:execute-api:regionName:accountNumber:restApiId/stage/METHOD/resourcePath',
      };
    
      const policy = new Policy(event);

      policy.addAllowedResource("*");

      const policyDocument = policy.generate('allow', {});

      const expected = {
        policyDocument: {
          Statement: [
            {
              Resource: ["*"]
            }
          ]
        }
      };
    
      expect(policyDocument).toMatchObject(expected);
    });

  });

});
