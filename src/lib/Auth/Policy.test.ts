import Policy from "./Policy";
import LambdaEventInterface from "../LambdaEvent/LambdaEventInterface";

describe("Tests Policy", () => {

  describe("Tests generater policy document", () => {

    test.each([
      [{}, {}],
      [{user: 'username'}, {user: 'username'}]
    ])('returns %o from %o that was initally passed', (actual, expected) => {
      const event: LambdaEventInterface = {
        methodArn: 'arn:aws:execute-api:regionName:accountNumber:restApiId/stage/METHOD/resourcePath',
      };
    
      const auth = new Policy(event);
      const policy = auth.generate('allow', actual);
    
      expect(policy.context).toMatchObject(expected);
    });

  });

});
