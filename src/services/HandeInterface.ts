import LambdaEventInterface from "src/lib/LambdaEvent/LambdaEventInterface";

import LambdaEvent from '../lib/LambdaEvent';

interface HandleInterface {
  handle(lambdaEvent: LambdaEvent): any
}

export default HandleInterface;
