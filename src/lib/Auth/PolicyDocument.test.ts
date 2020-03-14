import PolicyDocument from "./PolicyDocument";
import LambdaEventInterface from "../LambdaEvent/LambdaEventInterface";
import { EFFECT_ALLOW } from "./constants";

describe("Tests PolicyDocument", () => {

  describe("Tests generated policy document", () => {

    test.each([
      [{}, {}],
      [{user: 'username'}, {user: 'username'}]
    ])('returns %o from %o that was initally passed', (actual, expected) => {
      const event: LambdaEventInterface = {
        methodArn: 'arn:aws:execute-api:regionName:accountNumber:restApiId/stage/METHOD/resourcePath',
      };
    
      const policy = new PolicyDocument(event);
      const policyDocument = policy.generate(EFFECT_ALLOW, actual);
    
      expect(policyDocument.context).toMatchObject(expected);
    });

  });

  describe("Tests resources", () => {

    it('returns expected statement resources', () => {
      const event: LambdaEventInterface = {
        methodArn: 'arn:aws:execute-api:regionName:accountNumber:restApiId/stage/METHOD/resourcePath',
      };
    
      const policy = new PolicyDocument(event);

      policy.addAllowedResource("*");

      const policyDocument = policy.generate(EFFECT_ALLOW, {});

      const expected = {
        policyDocument: {
          Statement: [
            {
              Resource: [
                "*"
              ]
            }
          ]
        }
      };
    
      expect(policyDocument).toMatchObject(expected);
    });

  });

});
